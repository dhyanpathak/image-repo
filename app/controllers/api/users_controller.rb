# frozen_string_literal: true

class Api::UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    # can look at all of your own images but only public images for all other users 
    if authorized_user?
      images = Image.where(user_id: params[:id])
    else
      images = Image.where(user_id: params[id], is_public?: true)
    end
    
    result_images = images_with_urls(images)

    if @user
      render json: {
        user: @user,
        images: result_images
      }, status: :ok
    else
      render json: {
        status: 500,
        errors: ['user not found']
      }, status: :unprocessable_entry
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      login!
      render json: {
        status: 'created',
        user: @user
      }
    else
      render json: {
        status: 500,
        errors: @user.errors.full_messages
      }
    end
  end

  private

  def user_params
    params.require(:user).permit(:full_name, :email, :password, :password_confirmation)
  end
end
