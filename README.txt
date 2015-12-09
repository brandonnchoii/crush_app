README

Overview of code structure

How to compile, set up, deploy, and use your system

Any limitations in your current implementation
	
	Limitations in the backend database design include potentially incomprehensive checks for certain attributes (i.e. commitLevel in UserInf) and a lack of constraints on which interests can be defined in UserInterests. The interests could also be further categorized for matching suggestion purposes. Interests are also currently limited to three per user.
	
	Limitations in the frontend include

	Other limitations include the lack of a heuristic for restricting the number of messages that users can send within a given time period and lack of real data to incorporate into our database.