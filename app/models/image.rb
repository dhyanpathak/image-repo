class Image < ApplicationRecord
  include ImageUploader::Attachment(:file) # adds an `file` virtual attribute

  belongs_to :user

  # attr_accessor :is_public
  # alias :is_public? :is_public

  validates :file, presence: true
  validates :is_public?, inclusion: { in: [true, false] }
end
