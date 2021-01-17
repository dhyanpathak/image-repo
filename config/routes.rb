Rails.application.routes.draw do
  root 'homepage#index'

  get '/app', to: 'homepage#index'

  # auth
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'

  namespace :api, defaults: { format: :json } do
    resources :images, only: %i[index create show destroy update] 
    resources :users, only: %i[create show update]
  end
end
