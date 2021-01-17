# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    @user = User
            .find_by(email: session_params[:email])
            .try(:authenticate, session_params[:password])
    if @user
      login!
      render json: {
        logged_in: true,
        user: @user
      }
    else
      render json: {
        status: 401,
        errors: 'Invalid credentials. Try again.'
      }
    end
  end

  def is_logged_in?
    if logged_in? && current_user
      images = Image.where(user_id: current_user.id)
      result_images = images_with_urls(images)

      render json: {
        logged_in: true,
        user: current_user,
        user_images: result_images
      }
    else
      render json: {
        logged_in: false,
        message: 'User does not exist'
      }
    end
  end

  def destroy
    logout!
    render json: {
      status: 200,
      logged_out: true
    }
  end

  private

  def session_params
    params.require(:user).permit(:email, :password)
  end
end
