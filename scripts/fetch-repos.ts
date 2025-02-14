import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
config()

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required environment variables')
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// CLI arguments schema
const ArgsSchema = z.object({
  minStars: z.coerce.number().default(100),
  maxStars: z.coerce.number().default(1_000_000),
  maxResults: z.coerce.number().default(100),
  since: z.coerce.date().default(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }),
  until: z.coerce.date().optional(),
})

async function fetchRepos() {
  try {
    // Parse command line arguments
    const args = ArgsSchema.parse({
      minStars: process.argv[2],
      maxStars: process.argv[3],
      maxResults: process.argv[4],
      since: process.argv[5],
      until: process.argv[6],
    })
    console.log(args)

    // Build query
    let query = supabase
      .from('GithubRepoSignal')
      .select(`
        *,
        GithubRepo!inner (
          name,
          owner,
          description,
          homepage
        )
      `)
      .gte('createdAt', args.since.toISOString())
      .order('starCountChange', { ascending: false })
      .limit(args.maxResults)

    // Add until date filter if provided
    if (args.until) {
      query = query.lte('createdAt', args.until.toISOString())
    }

    // Add star count filters if provided
    if (args.minStars > 0 && args.maxStars > 0) {
      query = query
        .gte('starCount', args.minStars)
        .lte('starCount', args.maxStars)
    } else if (args.minStars > 0) {
      query = query.gte('starCount', args.minStars)
    } else if (args.maxStars > 0) {
      query = query.lte('starCount', args.maxStars)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Ensure data directory exists
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })

    // Write results to file
    await fs.writeFile(
      path.join(process.cwd(), 'data', 'repos.json'),
      JSON.stringify(data, null, 2)
    )

    console.log(`Successfully fetched ${data.length} repos and saved to data/repos.json`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fetchRepos()
