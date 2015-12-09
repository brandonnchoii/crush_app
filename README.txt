README

Overview of code structure

How to compile, set up, deploy, and use your system

Any limitations in your current implementation
	
	Limitations in the backend database design include potentially incomprehensive checks for certain attributes (i.e. commitLevel in UserInf) and a lack of constraints on which interests can be defined in UserInterests. The interests could also be further categorized for matching suggestion purposes. Interests are also currently limited to three per user.
	
	Limitations in the front-end include scalability of our code to different platforms such as mobile. Though we did utilize Bootstrap, some of our CSS components use pixels rather than percentages, which would therefore not scale accordingly based on screen size of the user. Moreover, any change in platform may require new front-code such as Swift for iOS and whatnot. Also, in terms of our actual code, 

	Other limitations include the lack of a heuristic for restricting the number of messages that users can send within a given time period and lack of real data to incorporate into our database.