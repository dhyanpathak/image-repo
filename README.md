# ImageRepo
This is an image repository built as a web application where users can view and upload their images (one-by-one or in bulk), add title/captions and control its public/private visibility. 

This web app has authentication/authorization capabilities, secure upload/storage/deletion of images and access control of images. It's also deployed on Heroku!

Check it out: https://dhyan-image-repo.herokuapp.com/

## How to use
Sign up for an account, upload 1 or several images in the Upload tab, fill out titles/captions/public setting. Check out other public images at the Feed tab. Delete or edit your images at the Profile page (click on your name).

## Tech

This was built with Ruby on Rails on the backend and React on the frontend. Several gems, packages and other technologies were used to make life easier and not reinvent the wheel. 
These are listed below:
* bcrypt - password hashing
* postgres - relational database. This was chosen for its ease in setup/deployment to Heroku. It's also ACID compliant and efficient for querying.
* google cloud storage - cloud storage for storing images
* shrine - file attachment toolkit gem. This was handy for security as I could validate acceptable file extension, mime type, file size. A deletion of the Image model also triggers the deletion of the file stored in google cloud storage
* bootstrap - front end framework
