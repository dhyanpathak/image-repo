require "shrine/storage/google_cloud_storage"
require "google/cloud/storage"

Google::Cloud::Storage.configure do |config|
  config.project_id  = ENV.fetch('GCS_PROJECT_ID')
  config.credentials = JSON.parse(ENV.fetch('GCS_CREDENTIALS'))
end

Shrine.storages = {
  cache: Shrine::Storage::GoogleCloudStorage.new(bucket: ENV.fetch('GCS_BUCKET_NAME')),
  store: Shrine::Storage::GoogleCloudStorage.new(bucket: ENV.fetch('GCS_BUCKET_NAME')),
}

Shrine.plugin :activerecord           # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :restore_cached_data    # extracts metadata for assigned cached files
Shrine.plugin :validation
Shrine.plugin :validation_helpers
Shrine.plugin :determine_mime_type
