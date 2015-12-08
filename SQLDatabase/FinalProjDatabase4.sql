CREATE TABLE UserInf
-- changed uid to serial but this may not actually work
(uid SERIAL PRIMARY KEY,
name VARCHAR(256) NOT NULL,
password VARCHAR(25) NOT NULL,
gender VARCHAR(256) NOT NULL,
email VARCHAR(256) NOT NULL UNIQUE,
birthday DATE NOT NULL,
phone CHAR(10) NOT NULL UNIQUE,
city VARCHAR(256) NOT NULL,
joindate DATE NOT NULL,
commitLevel VARCHAR(40) NOT NULL,
interestedIn VARCHAR(20) NOT NULL,
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
(user1 INTEGER NOT NULL REFERENCES UserInf(uid),
user2 INTEGER NOT NULL REFERENCES UserInf(uid),
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
	WHERE ( ((Relationships.user1 = NEW.user2 AND Relationships.user2 = NEW.user1)
    OR (Relationships.user1= NEW.user1 AND Relationships.user2=NEW.user2))
    AND Relationships.isReciprocated = false))) THEN
		DELETE from Relationships as r where ( (r.user1 = NEW.user1 AND r.user2 = NEW.user2) OR (r.user2=NEW.user1 AND r.user1 = NEW.user2));
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


INSERT INTO UserInf(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn)
VALUES('Anna', 'asodfim3', 'female','anna@duke.edu', '1994-03-05', '2153783609', 'Philadelphia', '2015-11-11','relationship', 'male');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Will', 'a', 'male', 'will@duke.edu', '1996-06-08', '1234567890', 'New York', '2015-12-15' , 'fwb', 'female');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Dan', 'a892m3mawn3', 'male', 'dan@duke.edu', '1987-03-01', '9087654321', 'Boston', '2015-10-11' , 'relationship', 'female');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Kelly', '8ja@*@#RFIU82', 'female', 'kelly@duke.edu', '1987-10-10', '9087987634', 'Boston', '2015-09-11' , 'fwb', 'male');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Emily', '8M*m8fnasdn8', 'female', 'emily@duke.edu', '1987-05-14', '8765567888', 'Toledo', '2015-12-11' , 'relationship', 'both');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Ian', 'iaofa3 1  a 23', 'male','ian@duke.edu', '1990-03-01', '9765123456', 'New York', '2015-10-09' , 'fwb', 'both');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Sarah', 'LOLOLOLOLOL', 'female', 'sarah@duke.edu', '1967-03-01', '9090909090', 'Tampa', '2015-12-11' , 'relationship', 'both');
INSERT INTO USERINF(name, password, gender, email, birthday, phone, city, joindate, commitLevel, interestedIn) VALUES('Sophie', '(*&@!*#&!(@&#(*', 'female', 'sophie@duke.edu', '1997-04-01', '3245234512', 'New York', '2015-4-11' , 'relationship', 'male');

INSERT INTO UserInterests VALUES(1,  'books');
INSERT INTO UserInterests VALUES(1, 'movies');
INSERT INTO UserInterests VALUES(1, 'sports' );
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

INSERT INTO Relationships VALUES(1, 2, true);
INSERT INTO Relationships VALUES(3, 5, false);
INSERT INTO Relationships VALUES(4, 6, true);
INSERT INTO Relationships VALUES(4, 7, false);
INSERT INTO Relationships VALUES(5, 2, false);
INSERT INTO Relationships VALUES(6, 8, true);
INSERT INTO Relationships VALUES(7, 8, false);

INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(1, 2, '2015-11-16 03:00', 'I think youre cute');
INSERT INTO Notifications(nFrom, nTo, ts, text) VALUES(1, 6, '2015-11-16 04:20', 'Meow');

INSERT INTO NotifState(seen, seenTs) VALUES(true, '2015-11-16 08:00');
INSERT INTO NotifState(seen) VALUES(false);