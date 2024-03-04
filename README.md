# 👋 Hello developer!

This project serves as an example of what can be achieved. It is not a fully functional product. Feel free to use the source code and ideas as a starting point for your own projects.

This is one of the many templates available from W3Schools. Check our [tutorials for frontend development](https://www.w3schools.com/where_to_start.asp) to learn the basics of [HTML](https://www.w3schools.com/html/default.asp), [CSS](https://www.w3schools.com/css/default.asp) and [JavaScript](https://www.w3schools.com/js/default.asp). 🦄

## Knowledge requirements

To be able to fully understand and modify this template to your needs, there are several things you should know (or learn):

- [HTML](https://www.w3schools.com/html/default.asp)
- [CSS](https://www.w3schools.com/css/default.asp)
- [JavaScript](https://www.w3schools.com/js/default.asp)
- [Node.js](https://www.w3schools.com/nodejs/default.asp)
- [Express.js](https://expressjs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [SQLite](https://www.sqlite.org/docs.html)

## 🔨 What's next?

Customize this template to make it your own.  
Remember to make your layout responsive - if you want your site to look good on smaller screens like mobile.  
Implement more functionalities like updating an existing data inside the database, or show even more information on the screen.

## 🎨 Where to find everything?
  
This template is made by using several technologies.  
Below are explanations about where to find specific code.

### HTML

HTML files are stored in a folder called `views`. Files have `.hbs` extension, indicating it is the [Handlebars](https://handlebarsjs.com/) file.
In `layouts/index.hbs` you can add your external links and scripts, or change other meaningful things that is relevant for every page.
Other pages you can find in views/. In this case there is just one `key-value-pairs.hbs`.

### CSS and Images

Images and CSS file can be found in the `public` folder.
Icons are stored as SVG files.

### Core JS files

You can find:
  - APIs in `app.js`.
  - JavaScript for database operations in `db/index.js`.
  - JavaScript for the frontend in `public/script.js`.

### Database

Dynamic spaces can use [SQLite](https://www.sqlite.org/docs.html) database.  
The database file is called `database.db`. It is placed inside the `w3s-dynamic-storage` folder.  
SQLite connection path to the database is `w3s-dynamic-storage/database.db` which you can use to connect to the SQLite database programmatically.   
For this template, the database connection path can also be found in the environment. 
Database creation and queries can be found in `db/index.js`.

---  
**Do not change the `w3s-dynamic-storage` folder name or `database.db` file name!**  
**By changing the `w3s-dynamic-storage` folder name or `database.db` file name, you risk the space not working properly.**

## What is needed if you want to integrate this template into another project

  - You can look into using `express.Router()` and add the routes to your project in a separate folder, or you can fuse the API routes from app.js into your own app.js, but make sure you have exclusive naming.
  - Do the same with views, db/index.js and public. 
  - Add the dependencies from `package.json` to your other `package.json`. Avoid duplications. Remember to `npm install`

## 🔨 Please note
For now files created/uploaded or edited from within the terminal view will not be backed up or synced. 

## ⛑ Need support?
[Join our Discord community](https://discord.gg/6Z7UaRbUQM) and ask questions in the **#spaces-general** channel to get your space on the next level.  
[Send us a ticket](https://support.w3schools.com/hc/en-gb) if you have any technical issues with Spaces.

Happy learning!