CREATE TABLE UserInf
-- changed uid to serial but this may not actually work
(uid SERIAL PRIMARY KEY,
name VARCHAR(256) NOT NULL,
password VARCHAR(25) NOT NULL,
gender VARCHAR(256) NOT NULL
 CHECK (gender = 'Male'
  OR gender = 'Female'
  OR gender = 'Trans'),
email VARCHAR(256) NOT NULL UNIQUE,
birthday DATE NOT NULL,
phone CHAR(10) NOT NULL UNIQUE,
city VARCHAR(256) NOT NULL,
joindate DATE NOT NULL,
commitLevel VARCHAR(40) NOT NULL
 CHECK (commitLevel = 'Casual'
  OR commitLevel = 'Relationship'),
interestedIn VARCHAR(20) NOT NULL
 CHECK (interestedIn = 'Male'
  OR interestedIn = 'Female'
  OR interestedIn = 'Both'),
profpic VARCHAR(256));
--(Above bolded may be mutable)
--interestedIn may be "Female" "Male" or "Both"

--(Table for mutables)
CREATE TABLE UserInterests
(uiid INTEGER NOT NULL REFERENCES UserInf(uid),
interest VARCHAR(20) NOT NULL,
PRIMARY KEY(uiid, interest));

CREATE TABLE Notifications
(nid SERIAL PRIMARY KEY,
nFrom INTEGER NOT NULL REFERENCES UserInf(uid),
nTo INTEGER NOT NULL REFERENCES UserInf(uid),
ts TIMESTAMP NOT NULL,
text VARCHAR(400));

CREATE TABLE NotifState
(sid SERIAL PRIMARY KEY REFERENCES Notifications(nid),
seen BOOLEAN NOT NULL,
seenTS TIMESTAMP);

CREATE TABLE Friend
(fid1 INTEGER NOT NULL REFERENCES UserInf(uid),
fid2 INTEGER NOT NULL REFERENCES UserInf(uid),
PRIMARY KEY(fid1, fid2));

CREATE TABLE Relationships
(user1 INTEGER NOT NULL REFERENCES UserInf(uid),  --from
user2 INTEGER NOT NULL REFERENCES UserInf(uid),   --to     
isReciprocated BOOLEAN NOT NULL,
PRIMARY KEY(user1, user2));


CREATE FUNCTION RelationshipTF() RETURNS TRIGGER AS $$
BEGIN
IF (NOT EXISTS
	(SELECT * FROM Relationships
	WHERE ((Relationships.user1 = NEW.user2 AND Relationships.user2 = NEW.user1)
    OR (Relationships.user1= NEW.user1 AND Relationships.user2=NEW.user2)))) THEN
		RETURN NEW;
END IF;
IF (EXISTS
	(SELECT * FROM Relationships
	WHERE ( (Relationships.user1 = NEW.user2 AND Relationships.user2 = NEW.user1)
    AND Relationships.isReciprocated = false))) THEN
		DELETE from Relationships as r where (r.user2=NEW.user1 AND r.user1 = NEW.user2);
        NEW.isReciprocated := true;
    RETURN NEW;
END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER RelationshipTG
BEFORE INSERT ON Relationships
FOR EACH ROW
EXECUTE PROCEDURE RelationshipTF();


INSERT INTO UserInf(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Anna Smith', 'annabobana', 'Female','anna@duke.edu', '1994-03-05', '2153783609', 'Philadelphia', '2015-11-11','Relationship', 'Male', 'anna.jpeg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Will Borg', 'a', 'Male', 'will@duke.edu', '1996-06-08', '1234567890', 'New York', '2015-12-15' , 'Casual', 'Female', 'will.jpg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Jun Yang', 'a23', 'Male', 'jun@duke.edu', '1987-03-01', '9087654321', 'Durham', '2015-10-11' , 'Relationship', 'Female', 'jun.jpg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Kelly Shi', '8', 'Female', 'kelly@duke.edu', '1987-10-10', '9087987634', 'Boston', '2015-09-11' , 'Casual', 'Male', 'kelly.jpg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Emily Pook', '09', 'Female', 'emily@duke.edu', '1987-05-14', '8765567888', 'Toledo', '2015-12-11' , 'Relationship', 'Both', 'emily.jpeg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Ian Faulk', 'deeeter', 'Male','ian@duke.edu', '1990-03-01', '9765123456', 'New York', '2015-10-09' , 'Casual', 'Both', 'ian.jpeg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Sarah Sapce', 'password', 'Female', 'sarah@duke.edu', '1967-03-01', '9090909090', 'Tampa', '2015-12-11' , 'Relationship', 'Both', 'sarah.jpeg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Sophie Neer', 'abba', 'Female', 'sophie@duke.edu', '1997-04-01', '3245234512', 'New York', '2015-4-11' , 'Relationship', 'Male', 'sophie.jpeg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Deega Soupa', 'bb', 'Female', 'deega@duke.edu', '1996-02-01', '1212121212', 'New York', '2015-4-11' , 'Relationship', 'Both', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Brandon Choi', 'bcfb', 'Male', 'brandon@duke.edu', '2000-04-01', '6666664512', 'New York', '2015-4-11' , 'Casual', 'Female', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('John Smith', 'j', 'Male', 'john@duke.edu', '1989-04-01', '3245234511', 'New York', '2015-4-11' , 'Relationship', 'Male', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Kat Abd', 'kk', 'Female', 'kat@duke.edu', '1997-07-01', '3245234712', 'Boston', '2015-4-11' , 'Casual', 'Both', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Karp Fish', 'aa', 'Female', 'karp@duke.edu', '1998-04-01', '3245239912', 'New York', '2015-4-11' , 'Casual', 'Both', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Tommy Jenkins', 'ab', 'Male', 'tommy@duke.edu', '1993-12-01', '8245234512', 'Houston', '2015-5-11' , 'Relationship', 'Female', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Alex Sanchez', 'alex', 'Female', 'alex@duke.edu', '1999-11-04', '2456234512', 'New York', '2015-7-11' , 'Casual', 'Male', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Aj Noor', '12', 'Male', 'aj@duke.edu', '1998-12-07', '2956234512', 'Tampa', '2015-8-11' , 'Casual', 'Female', 'aj.jpeg');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Dee Curtain', 'dee', 'Female', 'dee@duke.edu', '2000-11-04', '2456234599', 'New York', '2015-9-11' , 'Relationship', 'Male', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Dan Sanchez', 'dan', 'Male', 'dan@duke.edu', '2000-12-04', '2456239912', 'San Francisco', '2014-7-11' , 'Relationship', 'Male', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Coppa Sandy', 'copa', 'Male', 'coppa@duke.edu', '1999-12-11', '2456234999', 'Green Hill', '2015-7-11' , 'Relationship', 'Male', '');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn, profpic)
VALUES('Kevin Dee', 'kevin', 'Male', 'kevin@duke.edu', '1998-11-04', '2477234512', 'Houston', '2015-1-11' , 'Casual', 'Male', '');



INSERT INTO UserInterests VALUES(1,  'books');
INSERT INTO UserInterests VALUES(1, 'movies');
INSERT INTO UserInterests VALUES(1, 'sports');
INSERT INTO UserInterests VALUES(2, 'guns');
INSERT INTO UserInterests VALUES(2,'movies');
INSERT INTO UserInterests VALUES(2,'sports' );
INSERT INTO UserInterests VALUES(3, 'animals');
INSERT INTO UserInterests VALUES(3, 'netflix');
INSERT INTO UserInterests VALUES(3, 'classical music');
INSERT INTO UserInterests VALUES(4, 'writing');
INSERT INTO UserInterests VALUES(4, 'movies');
INSERT INTO UserInterests VALUES(4, 'sports' );
INSERT INTO UserInterests VALUES(5, 'cooking');
INSERT INTO UserInterests VALUES(5, 'books');
INSERT INTO UserInterests VALUES(5, 'netflix' );
INSERT INTO UserInterests VALUES(6, 'movies');
INSERT INTO UserInterests VALUES(6, 'classical music');
INSERT INTO UserInterests VALUES(6, 'ballet' );
INSERT INTO UserInterests VALUES(7, 'horses');
INSERT INTO UserInterests VALUES(7, 'movies');
INSERT INTO UserInterests VALUES(7, 'sports' );
INSERT INTO UserInterests VALUES(8, 'video games');
INSERT INTO UserInterests VALUES(8, 'fashion');
INSERT INTO UserInterests VALUES(8, 'music' );
INSERT INTO UserInterests VALUES(9, 'music' );
INSERT INTO UserInterests VALUES(9, 'movies');
INSERT INTO UserInterests VALUES(9, 'sports' );
INSERT INTO UserInterests VALUES(10, 'cooking');
INSERT INTO UserInterests VALUES(10, 'books');
INSERT INTO UserInterests VALUES(10, 'netflix' );
INSERT INTO UserInterests VALUES(11, 'horses');
INSERT INTO UserInterests VALUES(11, 'movies');
INSERT INTO UserInterests VALUES(11, 'sports' );
INSERT INTO UserInterests VALUES(12, 'horses');
INSERT INTO UserInterests VALUES(12, 'movies');
INSERT INTO UserInterests VALUES(12, 'sports' );
INSERT INTO UserInterests VALUES(13, 'movies');
INSERT INTO UserInterests VALUES(13, 'classical music');
INSERT INTO UserInterests VALUES(13, 'ballet' );
INSERT INTO UserInterests VALUES(14,  'books');
INSERT INTO UserInterests VALUES(14, 'movies');
INSERT INTO UserInterests VALUES(14, 'sports');
INSERT INTO UserInterests VALUES(15, 'cooking');
INSERT INTO UserInterests VALUES(15, 'books');
INSERT INTO UserInterests VALUES(15, 'netflix' );
INSERT INTO UserInterests VALUES(16, 'guns');
INSERT INTO UserInterests VALUES(16,'movies');
INSERT INTO UserInterests VALUES(16,'sports' );
INSERT INTO UserInterests VALUES(17,  'books');
INSERT INTO UserInterests VALUES(17, 'movies');
INSERT INTO UserInterests VALUES(17, 'sports');
INSERT INTO UserInterests VALUES(18, 'video games');
INSERT INTO UserInterests VALUES(18, 'fashion');
INSERT INTO UserInterests VALUES(18, 'music' );
INSERT INTO UserInterests VALUES(19, 'movies');
INSERT INTO UserInterests VALUES(19, 'sports' );
INSERT INTO UserInterests VALUES(19, 'cooking');
INSERT INTO UserInterests VALUES(19, 'movies');
INSERT INTO UserInterests VALUES(19, 'sports' );
INSERT INTO UserInterests VALUES(19, 'cooking');
INSERT INTO UserInterests VALUES(20, 'cooking');
INSERT INTO UserInterests VALUES(20, 'books');
INSERT INTO UserInterests VALUES(20, 'netflix' );




INSERT INTO Friend VALUES(1,3);
INSERT INTO Friend VALUES(1,6);
INSERT INTO Friend VALUES(1,2);
INSERT INTO Friend VALUES(2,3);
INSERT INTO Friend VALUES(2,4);
INSERT INTO Friend VALUES(2,5);
INSERT INTO Friend VALUES(2,7);
INSERT INTO Friend VALUES(2,8);
INSERT INTO Friend VALUES(3,5);
INSERT INTO Friend VALUES(3,7);
INSERT INTO Friend VALUES(4,6);
INSERT INTO Friend VALUES(5,6);
INSERT INTO Friend VALUES(5,7);
INSERT INTO Friend VALUES(6,8);
INSERT INTO Friend VALUES(7,8);
INSERT INTO Friend VALUES(9,8);
INSERT INTO Friend VALUES(9,18);
INSERT INTO Friend VALUES(10,1);
INSERT INTO Friend VALUES(10,5);
INSERT INTO Friend VALUES(11,2);
INSERT INTO Friend VALUES(11,16);
INSERT INTO Friend VALUES(12,2);
INSERT INTO Friend VALUES(12,20);
INSERT INTO Friend VALUES(13,3);
INSERT INTO Friend VALUES(13,14);
INSERT INTO Friend VALUES(14,8);
INSERT INTO Friend VALUES(14,7);
INSERT INTO Friend VALUES(15,12);
INSERT INTO Friend VALUES(15,1);
INSERT INTO Friend VALUES(16,3);
INSERT INTO Friend VALUES(16,19);
INSERT INTO Friend VALUES(17,2);
INSERT INTO Friend VALUES(17,20);
INSERT INTO Friend VALUES(18,9);
INSERT INTO Friend VALUES(18,8);
INSERT INTO Friend VALUES(19,6);
INSERT INTO Friend VALUES(19,4);
INSERT INTO Friend VALUES(20,9);
INSERT INTO Friend VALUES(20,8);





INSERT INTO Relationships VALUES(1, 2, true);
INSERT INTO Relationships VALUES(3, 5, false);
INSERT INTO Relationships VALUES(4, 6, true);
INSERT INTO Relationships VALUES(4, 7, false);
INSERT INTO Relationships VALUES(5, 2, false);
INSERT INTO Relationships VALUES(6, 8, true);
INSERT INTO Relationships VALUES(7, 8, false);
INSERT INTO Relationships VALUES(9, 11, false);
INSERT INTO Relationships VALUES(10, 13, true);
INSERT INTO Relationships VALUES(15, 16, false);
INSERT INTO Relationships VALUES(19, 20, true);


INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(1, 2, '2015-11-16 03:00', 'I think youre cute');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(2, 1, '2015-11-16 03:07', 'Me too');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(3, 5, '2015-12-06 08:30', 'Hello');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(4, 6, '2015-12-06 08:40', 'Hey baby');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(6, 4, '2015-12-07 09:15', 'Oh, Ah');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(4, 7, '2015-12-07 08:30', 'I like you');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(5, 2, '2015-12-07 08:35', 'I like to watch you sleep');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(6, 8, '2015-12-08 09:30', 'I follow you home a lot');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(8, 6, '2015-12-08 10:30', 'You should come in some time');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(7, 8, '2015-12-08 08:30', 'Hello');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(9, 11, '2015-12-08 10:30', 'Hi beautiful.');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(10, 13, '2015-12-19 10:32', 'You are awesome');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(10, 13, '2015-12-19 10:40', 'I love you');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(13, 10, '2015-12-19 10:45', 'Thanks!');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(15, 16, '2015-12-19 10:46', 'You should come over sometime');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(19, 20, '2015-12-19 10:50', 'You have great skin');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(20, 19, '2015-12-19 11:00', 'I use lots of baby oil');
