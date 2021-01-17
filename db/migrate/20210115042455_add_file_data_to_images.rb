class AddFileDataToImages < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :file_data, :text
  end
end
