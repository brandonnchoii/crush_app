# crush_app
CS 316: Database Systems.

Team: Cali Nelson, Callie Mao, Brandon Choi, Kevin Tie

Overview of code structure:

Tech Stack: PostgreSQL, Node.js, Angularjs

crush_app<br>
—bin<br>
-bower_components<br>
-client<br>
--images<br>
----ALL PICTURES (.jpg, .jpeg)<br>
--public<br>
----javascripts<br>
---------app.js (node server code, API)<br>
----stylesheets<br>
---------ALL CSS FILES<br>
----fonts<br>
---------ALL FONT FILES<br>
--views<br>
----ALL HTML FILES<br>
-node_modules<br>
-SQLDatabase<br>
--DATABASE SQL CODE<br>
-server<br>
--models<br>
--routes<br>
----routes.js (routing js code, connects API to database)<br>


How to compile, set up, deploy, and use your system:

1. Download Postgres application.
2. Install Node.js on computer.
3. Clone GitHub repository (https://github.com/brandonnchoii/crush_app) onto local machine.
4. Set up Postgres server by running “create database crush” and then entering our SQL code with pseudo data.
5. Enter cloned repo and run Node.js by running “npm start”.
6. Test application through localhost:3000.
7. Enjoy Crush!


Any limitations in your current implementation:
	
Limitations in the backend database design include potentially incomprehensive checks for certain attributes (i.e. commitLevel in UserInf) and a lack of constraints on which interests can be defined in UserInterests. The interests could also be further categorized for matching suggestion purposes. Interests are also currently limited to three per user.
	
Limitations in the front-end include scalability of our code to different platforms such as mobile. Though we did utilize Bootstrap, some of our CSS components use pixels rather than percentages, which would therefore not scale accordingly based on screen size of the user. Moreover, any change in platform may require new front-code such as Swift for iOS and whatnot. Also, in terms of our actual code, our code could be separated further by refactoring our node API into multiple controllers. Overall, reorganization of the front-end code would help to make further development easier as well as the code more efficient. Finally, because our application is social media based and always changing, we would want to implement error checking in the future. This would ensure a more secure and practical environment for our dating app.

Other limitations include the lack of a heuristic for restricting the number of messages that users can send within a given time period and lack of real data to incorporate into our database. In a more sophisticated version of our application, we could potentially implement more complex algorithms for offering smarter suggestions or tracking abusive behavior by users. 