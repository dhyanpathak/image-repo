class ImageUploader < Shrine 
  Attacher.validate do
    validate_max_size 15.megabyte # max size for image is 10mb
    validate_mime_type %w[image/jpeg image/png image/gif] # validate mime types for only image file extensions
  end
end