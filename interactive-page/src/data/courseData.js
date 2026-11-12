export const COURSE_METADATA = {
  slug: 'de-zoomcamp',
  title: 'Data Engineering Zoomcamp',
  subtitle: 'A Free 9-Week Intensive Course on Production Data Engineering Fundamentals',
  currentCohort: '2027',
  hashtag: '#dezoomcamp',
  urls: {
    repository: 'https://github.com/DataTalksClub/data-engineering-zoomcamp',
    register: 'https://courses.datatalks.club/register/de-zoomcamp/',
    platform: 'https://courses.datatalks.club/',
    playlist: 'https://www.youtube.com/playlist?list=PL3MmuxUbc_hJed7dXYoJw8DoCuVHhGEQb',
    slack: 'https://datatalks.club/slack.html',
    slackChannel: 'https://app.slack.com/client/T01ATQK62F8/C01FABYF2RG',
    telegram: 'https://t.me/dezoomcamp',
    faq: 'https://datatalks.club/faq/data-engineering-zoomcamp.html',
    docs: 'https://datatalks.club/docs/courses/data-engineering-zoomcamp/',
  },
};

export const HOMEWORK_QUIZZES = {
  m1: {
    moduleId: 'm1',
    title: 'Module 1 Homework: Docker, SQL & Terraform',
    cohortPath: 'cohorts/2026/01-docker-terraform/homework.md',
    questions: [
      {
        id: 'm1-q1',
        question:
          'Given the course docker-compose.yaml with services "db" (container_name: postgres, ports: "5433:5432") and "pgadmin", what hostname and port should pgAdmin use to connect to PostgreSQL inside the Docker network?',
        options: ['localhost:5432', 'db:5432 (or postgres:5432)', 'db:5433', 'localhost:5433'],
        correctIndex: 1,
        explanation:
          'Containers on the same Docker Compose network communicate over the internal container port (5432) using either the service name (db) or container_name (postgres). Port 5433 is only the host port mapping.',
      },
      {
        id: 'm1-q2',
        question:
          'In the November 2025 Green Taxi dataset (green_tripdata_2025-11.parquet), how many trips had a trip_distance <= 1.0 mile?',
        options: ['7,853', '8,007', '8,254', '8,421'],
        correctIndex: 1,
        explanation:
          'Filtering lpep_pickup_datetime in [2025-11-01, 2025-12-01) and trip_distance <= 1.0 returns 8,007 short trips.',
      },
      {
        id: 'm1-q3',
        question:
          'For passengers picked up in "East Harlem North" in November 2025, which drop-off zone had the single largest tip_amount?',
        options: ['JFK Airport', 'Yorkville West', 'East Harlem North', 'LaGuardia Airport'],
        correctIndex: 1,
        explanation:
          'Joining green_tripdata_2025-11 with taxi_zone_lookup on PULocationID ("East Harlem North") and ordering by tip_amount DESC reveals Yorkville West as the dropoff zone with the largest tip.',
      },
      {
        id: 'm1-q4',
        question:
          'Which sequence of commands describes the Terraform workflow for: (1) downloading provider plugins, (2) generating & auto-executing changes, and (3) removing all managed resources?',
        options: [
          'terraform import, terraform apply -y, terraform destroy',
          'terraform init, terraform plan -auto-apply, terraform rm',
          'terraform init, terraform apply -auto-approve, terraform destroy',
          'terraform init, terraform run -auto-approve, terraform destroy',
        ],
        correctIndex: 2,
        explanation:
          '`terraform init` initializes providers/backends, `terraform apply -auto-approve` plans and applies without interactive prompt, and `terraform destroy` tears down all managed resources.',
      },
    ],
  },
  m2: {
    moduleId: 'm2',
    title: 'Module 2 Homework: Workflow Orchestration with Kestra',
    cohortPath: 'cohorts/2026/02-workflow-orchestration/homework.md',
    questions: [
      {
        id: 'm2-q1',
        question:
          'What is the rendered value of the Kestra variable `file: "{{inputs.taxi}}_tripdata_{{inputs.year}}-{{inputs.month}}.csv"` when inputs are taxi=green, year=2020, month=04?',
        options: [
          '{{inputs.taxi}}_tripdata_{{inputs.year}}-{{inputs.month}}.csv',
          'green_tripdata_2020-04.csv',
          'green_tripdata_04_2020.csv',
          'green_tripdata_2020.csv',
        ],
        correctIndex: 1,
        explanation:
          'Kestra Pebble expressions interpolate {{inputs.taxi}}, {{inputs.year}}, and {{inputs.month}} directly into `green_tripdata_2020-04.csv`.',
      },
      {
        id: 'm2-q2',
        question:
          'Within the Kestra execution for Yellow Taxi data for December 2020 (yellow_tripdata_2020-12.csv), what is the uncompressed file size produced by the extract task?',
        options: ['128.3 MiB', '134.5 MiB', '364.7 MiB', '692.6 MiB'],
        correctIndex: 1,
        explanation:
          'In the Kestra execution outputs tab, `yellow_tripdata_2020-12.csv` measures 134.5 MiB uncompressed.',
      },
      {
        id: 'm2-q3',
        question:
          'How many total rows are there across all Yellow Taxi CSV files for the entire year 2020?',
        options: ['13,537,299', '24,648,499', '18,324,219', '29,430,127'],
        correctIndex: 1,
        explanation:
          'Querying `SELECT COUNT(*) FROM yellow_tripdata WHERE filename LIKE "yellow_tripdata_2020%"` after backfilling 2020 yields 24,648,499 rows (and 1,734,051 rows for Green 2020).',
      },
      {
        id: 'm2-q4',
        question: 'How do you configure the timezone to New York in a Kestra Schedule trigger?',
        options: [
          'Add a timezone property set to EST in the Schedule trigger',
          'Add a timezone property set to America/New_York in the Schedule trigger',
          'Add a timezone property set to UTC-5 in the Schedule trigger',
          'Add a location property set to New_York in the Schedule trigger',
        ],
        correctIndex: 1,
        explanation:
          'Kestra Schedule triggers use standard IANA timezone identifiers such as `timezone: America/New_York`.',
      },
    ],
  },
  m3: {
    moduleId: 'm3',
    title: 'Module 3 Homework: Data Warehousing & BigQuery',
    cohortPath: 'cohorts/2026/03-data-warehouse/homework.md',
    questions: [
      {
        id: 'm3-q1',
        question:
          'When running `SELECT COUNT(DISTINCT PULocationID)` on both an External GCS Parquet Table and a Materialized BigQuery Table (Jan–Jun 2024 Yellow Taxi, 20,332,093 rows), what is the estimated data read shown by BigQuery?',
        options: [
          '18.82 MB for External Table and 47.60 MB for Materialized Table',
          '0 MB for External Table and 155.12 MB for Materialized Table',
          '2.14 GB for External Table and 0 MB for Materialized Table',
          '0 MB for External Table and 0 MB for Materialized Table',
        ],
        correctIndex: 1,
        explanation:
          'BigQuery cannot estimate bytes ahead of time for an External Table stored in GCS (showing 0 MB estimate), whereas for the native Materialized Table it accurately estimates 155.12 MB for the PULocationID column.',
      },
      {
        id: 'm3-q2',
        question:
          'Why does querying two columns (PULocationID, DOLocationID) on a BigQuery table estimate roughly double the bytes compared to querying one column (PULocationID)?',
        options: [
          'BigQuery is a columnar database and only scans the specific columns requested in the query.',
          'BigQuery duplicates data across storage partitions, scanning the table twice.',
          'BigQuery performs an implicit join between every selected column.',
          'BigQuery caches only the first column in memory.',
        ],
        correctIndex: 0,
        explanation:
          'BigQuery stores data in Capacitor columnar format, reading only the requested column files.',
      },
      {
        id: 'm3-q3',
        question:
          'If your queries always filter by `tpep_dropoff_datetime` and order/filter by `VendorID`, what is the optimal table strategy in BigQuery?',
        options: [
          'Partition by DATE(tpep_dropoff_datetime) and Cluster by VendorID',
          'Cluster by tpep_dropoff_datetime and Cluster by VendorID',
          'Cluster by tpep_dropoff_datetime and Partition by VendorID',
          'Partition by both tpep_dropoff_datetime and VendorID',
        ],
        correctIndex: 0,
        explanation:
          'Partitioning by `DATE(tpep_dropoff_datetime)` prunes date ranges (reducing a 15-day query from 310.24 MB to 26.84 MB), while Clustering by `VendorID` sorts blocks within each partition.',
      },
      {
        id: 'm3-q4',
        question:
          'True or False: It is best practice in BigQuery to ALWAYS cluster your data, even for small tables under 1 GB.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation:
          'False! For tables smaller than ~1 GB, partitioning and clustering add metadata and maintenance overhead without meaningful query cost or performance improvement.',
      },
    ],
  },
  m4: {
    moduleId: 'm4',
    title: 'Module 4 Homework: Analytics Engineering with dbt',
    cohortPath: 'cohorts/2026/04-analytics-engineering/homework.md',
    questions: [
      {
        id: 'm4-q1',
        question:
          'In a dbt project where `int_trips_unioned` depends on `stg_green_tripdata` and `stg_yellow_tripdata`, what models are built when you run `dbt run --select int_trips_unioned` (without `+` prefixes/suffixes)?',
        options: [
          'stg_green_tripdata, stg_yellow_tripdata, and int_trips_unioned',
          'Any model with upstream and downstream dependencies',
          'int_trips_unioned only',
          'int_trips_unioned and downstream fact tables',
        ],
        correctIndex: 2,
        explanation:
          'Without the `+` graph operator (like `+int_trips_unioned` or `int_trips_unioned+`), `dbt run --select int_trips_unioned` builds ONLY `int_trips_unioned`.',
      },
      {
        id: 'm4-q2',
        question:
          'You configured `accepted_values: [1, 2, 3, 4, 5]` on `payment_type` in `fct_trips`. A new value `6` appears in source data. What happens when you run `dbt test --select fct_trips`?',
        options: [
          'dbt skips the test because the SQL file did not change',
          'dbt fails the test, returning a non-zero exit code',
          'dbt passes with a warning by default',
          'dbt auto-updates schema.yml to include 6',
        ],
        correctIndex: 1,
        explanation:
          'By default, dbt generic tests have severity `error`. Any rows violating `accepted_values` cause the test query to return failing rows and exit with a non-zero code.',
      },
      {
        id: 'm4-q3',
        question:
          'Using `fct_monthly_zone_revenue`, which pickup zone had the highest total revenue for Green taxi trips in 2020, and how many Green taxi trips occurred in October 2019?',
        options: [
          'East Harlem North (2020 top zone) & 384,624 trips (Oct 2019)',
          'Morningside Heights (2020 top zone) & 500,234 trips (Oct 2019)',
          'East Harlem South (2020 top zone) & 350,891 trips (Oct 2019)',
          'Washington Heights South (2020 top zone) & 421,509 trips (Oct 2019)',
        ],
        correctIndex: 0,
        explanation:
          'East Harlem North generated the highest 2020 Green taxi revenue, and October 2019 recorded 384,624 total Green taxi trips across 12,184 monthly zone revenue records.',
      },
      {
        id: 'm4-q4',
        question:
          'After filtering out `dispatching_base_num IS NULL` from the 2019 FHV trip data in `stg_fhv_tripdata`, how many records remain?',
        options: ['42,084,899', '43,244,693', '22,998,722', '44,112,187'],
        correctIndex: 1,
        explanation:
          'The 2019 FHV dataset has 43,244,693 valid records where `dispatching_base_num IS NOT NULL`.',
      },
    ],
  },
  m5: {
    moduleId: 'm5',
    title: 'Module 5 Homework: Data Platforms with Bruin',
    cohortPath: 'cohorts/2026/05-data-platforms/homework.md',
    questions: [
      {
        id: 'm5-q1',
        question: 'In a Bruin project, what are the required files and directories?',
        options: [
          'bruin.yml and assets/',
          '.bruin.yml and pipeline.yml (assets can be anywhere)',
          '.bruin.yml and a pipeline directory containing pipeline.yml and assets/',
          'pipeline.yml and assets/ only',
        ],
        correctIndex: 2,
        explanation:
          'A Bruin project requires `.bruin.yml` at the root (for environments/connections) and a pipeline folder containing `pipeline.yml` and an `assets/` subfolder.',
      },
      {
        id: 'm5-q2',
        question:
          'Which Bruin materialization strategy is best for incrementally processing a specific time window by deleting and re-inserting data for that interval based on `pickup_datetime`?',
        options: ['append', 'replace', 'time_interval', 'view'],
        correctIndex: 2,
        explanation:
          '`time_interval` deletes rows within the `[start_timestamp, end_timestamp]` window and inserts the freshly computed rows for idempotent incremental runs.',
      },
      {
        id: 'm5-q3',
        question:
          'You modified `ingestion/trips.py` and want to run it plus all downstream dependent assets, overriding `taxi_types` to `["yellow"]`. Which flags do you use?',
        options: [
          'bruin run ingestion/trips.py --downstream --var \'taxi_types=["yellow"]\'',
          'bruin run --select ingestion.trips+ --set taxi_types=yellow',
          'bruin run ingestion.trips --all --taxi-types yellow',
          'bruin run pipeline/trips.py --recursive',
        ],
        correctIndex: 0,
        explanation:
          '`--downstream` executes the target asset and all downstream dependents, and `--var \'taxi_types=["yellow"]\'` overrides JSON/array pipeline variables.',
      },
      {
        id: 'm5-q4',
        question:
          'Which Bruin command visualizes the dependency graph between assets, and which flag creates tables from scratch on a first-time run?',
        options: [
          '`bruin lineage` and `--full-refresh`',
          '`bruin graph` and `--create`',
          '`bruin dependencies` and `--init`',
          '`bruin show` and `--truncate`',
        ],
        correctIndex: 0,
        explanation:
          '`bruin lineage` inspects upstream/downstream dependencies, and `bruin run --full-refresh` drops/creates tables from scratch.',
      },
    ],
  },
  m6: {
    moduleId: 'm6',
    title: 'Module 6 Homework: Batch Processing with Apache Spark',
    cohortPath: 'cohorts/2026/06-batch/homework.md',
    questions: [
      {
        id: 'm6-q1',
        question:
          'When you read `yellow_tripdata_2025-11.parquet` into a Spark DataFrame, `.repartition(4)`, and write to Parquet, what is the average size of each `.parquet` file created?',
        options: ['6 MB', '25 MB', '75 MB', '100 MB'],
        correctIndex: 1,
        explanation:
          'Each of the 4 partitioned Parquet files is approximately 24.4 MB, which closely matches 25 MB.',
      },
      {
        id: 'm6-q2',
        question:
          'In the November 2025 Yellow Taxi dataset, how many trips started on November 15th (`2025-11-15`), and what was the longest trip duration in hours across the dataset?',
        options: [
          '162,604 trips on Nov 15 & 90.6 hours max duration',
          '102,340 trips on Nov 15 & 58.2 hours max duration',
          '225,768 trips on Nov 15 & 134.5 hours max duration',
          '62,610 trips on Nov 15 & 22.7 hours max duration',
        ],
        correctIndex: 0,
        explanation:
          'Filtering `F.to_date("tpep_pickup_datetime") == "2025-11-15"` yields 162,604 trips, and the maximum `(dropoff - pickup) / 3600` duration is 90.6 hours.',
      },
      {
        id: 'm6-q3',
        question:
          'On which local port does Spark’s application Web UI dashboard run by default?',
        options: ['80', '443', '4040', '8080'],
        correctIndex: 2,
        explanation:
          'Spark’s Driver Web UI (jobs, stages, storage, SQL DAGs, executors) runs on http://localhost:4040 by default.',
      },
      {
        id: 'm6-q4',
        question:
          'Joining the November 2025 Yellow Taxi data with `taxi_zone_lookup.csv`, which pickup Zone is tied for the LEAST frequent (only 1 pickup)?',
        options: [
          "Governor's Island/Ellis Island/Liberty Island (and Arden Heights)",
          'JFK Airport',
          'Midtown Center',
          'East Harlem North',
        ],
        correctIndex: 0,
        explanation:
          "Governor's Island/Ellis Island/Liberty Island, Arden Heights, and Eltingville/Annadale/Prince's Bay are tied at count = 1.",
      },
    ],
  },
  m7: {
    moduleId: 'm7',
    title: 'Module 7 Homework: Streaming with Redpanda & PyFlink',
    cohortPath: 'cohorts/2026/07-streaming/homework.md',
    questions: [
      {
        id: 'm7-q1',
        question:
          'When streaming all 49,416 rows of October 2025 Green Taxi data (`green_tripdata_2025-10.parquet`) to the Redpanda `green-trips` topic and reading back with a Kafka consumer (`auto_offset_reset="earliest"`), how many trips have `trip_distance > 5.0`?',
        options: ['6,506', '7,506', '8,506', '9,506'],
        correctIndex: 2,
        explanation:
          'Producing the 49,416 events takes ~10 seconds, and 8,506 messages have `trip_distance > 5.0`.',
      },
      {
        id: 'm7-q2',
        question:
          'Using a 5-minute Tumbling Window in PyFlink on `green-trips`, which `PULocationID` had the highest number of trips in a single 5-minute window?',
        options: ['42', '74 (East Harlem North — 15 trips)', '75', '166'],
        correctIndex: 1,
        explanation:
          'PULocationID 74 (East Harlem North) peaks at 15 trips within a single 5-minute tumbling window.',
      },
      {
        id: 'm7-q3',
        question:
          'Using a PyFlink Session Window with a 5-minute inactivity gap on `PULocationID` (with parallelism=1 and 5-second watermark), how many trips were in the longest continuous session?',
        options: ['12 trips', '31 trips', '51 trips', '81 trips (PULocationID 74 on 2025-10-08)'],
        correctIndex: 3,
        explanation:
          'PULocationID 74 had an unbroken session of 81 trips on the morning of 2025-10-08 where consecutive rides arrived within 5 minutes of each other.',
      },
      {
        id: 'm7-q4',
        question:
          'Using a 1-hour Tumbling Window across all locations in October 2025 Green Taxi data, which hour recorded the highest total `tip_amount` (~$524.96)?',
        options: [
          '2025-10-01 18:00:00',
          '2025-10-16 18:00:00',
          '2025-10-22 08:00:00',
          '2025-10-30 16:00:00',
        ],
        correctIndex: 1,
        explanation:
          'The 1-hour window starting `2025-10-16 18:00:00` had the highest aggregate tips at ~$524.96.',
      },
    ],
  },
};
