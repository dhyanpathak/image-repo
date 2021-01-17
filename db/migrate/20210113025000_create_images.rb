class CreateImages < ActiveRecord::Migration[5.1]
  def change
    create_table :images do |t|
      t.string :title
      t.boolean :is_public?
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
