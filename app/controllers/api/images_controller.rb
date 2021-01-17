# frozen_string_literal: true

class Api::ImagesController < ApplicationController
  before_action :logged_in?

  def index
    # get images for Feed, sort by recently created and allow pagination
    images = Image.where(is_public?: true).order('created_at DESC').page(image_params[:page])
    result_images = images_with_urls(images) # attach url to images rather than the Shrine file object

    render json: {
      feed: result_images
    }, status: :ok
  end

  def show
    image = Image.find(params[:id])
    render json: { data: image }, status: :ok
  end

  def create
    # arrays of files, titles, captions, public permission settings used to iteratively create Images
    files = params[:images] 
    titles, captions, publics = image_params.values_at(:titles, :captions, :publics)
    counter = files.length # count of remaining number of models to create
    images = []

    files.each_with_index do |file, i|
      is_public = publics[i] == "true" 
      image = Image.new(title: titles[i], caption: captions[i], is_public?: is_public, file: file, user_id: current_user.id)
      if image.save
        counter -= 1
        images << image
      else
        # p image.errors
        image.file.delete
        image.delete
      end
    end

    if counter.zero? # success, as long as every remaining images have been made 
      result_images = images_with_urls(images)
      render json: { images: result_images, message: "Successfully uploaded! Check your profile to see." }, status: :ok
    else
      render json: { message: "Unsuccessful upload." }, status: :unprocessable_entity
    end
  end

  def destroy
    image = Image.find(params[:id])
    # access control, can only delete an image if subject is the owner of that image
    if owner?(image.user_id)
      image.destroy
    else
      render json: { errors: 'Could not delete. You are not the owner.' }, status: :unprocessable_entry
    end

    if image
      render json: { image: image }, status: :ok
    else
      render json: { errors: 'Could not delete' }, status: :unprocessable_entry
    end
  end

  def update
    image = Image.find(params[:id])
    # access control, can only update an image if subject is the owner of that image
    if owner?(image.user_id)
      if image.update_attributes(image_params.except(:id, :page, :image, :images, :titles, :publics, :format))
        render json: { image: image }, status: :ok
      else
        render json: { errors: image.errors }, status: :unprocessable_entity
      end
    else
      render json: { errors: 'Could not update. You are not the owner.' }, status: :unprocessable_entity
    end
  end

  private
  # image model has foreign key to a user id, used to very if current user is owner of that image
  def owner?(image_user_id)
    current_user.id == image_user_id
  end

  def image_params
    params.permit(:id, :title, :caption, :is_public?, :page, :format, 
      :images => [:file], :titles => [], :captions => [], :publics => [])
  end
end
