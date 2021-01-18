# ImageRepo
This is an image repository built as a web application where users can view/edit/delete/upload their images, add title/captions and control its public/private visibility. 

This web app has authentication/authorization capabilities, secure upload/storage/deletion of images, one-by-one or bulk uploads and access control of images. It's also deployed on Heroku!

Check it out: https://dhyan-image-repo.herokuapp.com/

## How to use
Sign up for an account, upload 1 or several images in the Upload tab, fill out titles/captions/public settings. Check out other public images in the Feed tab. Delete or edit your images at the Profile page (under your name).

## Tech

This was built with Ruby on Rails for the backend and React for the frontend. Several gems, packages and other technologies were used to make life easier and not reinvent the wheel. 
These are listed below:
* bcrypt - password hashing
* postgres - relational database. This was chosen for its ease in setup/deployment to Heroku. It's also ACID compliant and efficient for querying.
* google cloud storage - cloud storage for storing images
* shrine - file attachment toolkit gem. This was handy for security as I could validate acceptable file extension, mime type, file size. A deletion of the Image model also triggers the deletion of the file stored in google cloud storage
* bootstrap - front end framework

## Cool things I wish I added
* search by text feature - it's very easy to search for an image based on title/caption with a `self.search` model method that does a query like `where(['LOWER(title) LIKE ?', "%#{keyword.downcase}%"]) if keyword` and using it like `Image.search(params[:search])`
* search for similar image - this is also a doable feature with the help of automatic image classification/tagging APIs (offered by companies like Imagga) where detected and highly confident tags are associated to a submitted image. Searching for a similar image would then be querying for images that have the closest amount of those tags.
* sophisticated access control policy - my security course was really interesting and it would be cool to implement common access control policies or use popular gems like pundit or cancan for handling auth in a more sophisticated manner for the backend. 
