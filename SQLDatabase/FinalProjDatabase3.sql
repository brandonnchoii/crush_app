CREATE TABLE UserInf
(uid INTEGER NOT NULL PRIMARY KEY,
name VARCHAR(256) NOT NULL,
gender VARCHAR(256) NOT NULL,
email VARCHAR(256) NOT NULL UNIQUE,
birthday DATE NOT NULL,
phone CHAR(10) NOT NULL UNIQUE,
city VARCHAR(256) NOT NULL,
joindate DATE NOT NULL,
commitLevel VARCHAR(40) NOT NULL,
interestedIn VARCHAR(20) NOT NULL);
--(Above bolded may be mutable)

--(Table for mutables)
CREATE TABLE UserInterests
(uiid INTEGER NOT NULL PRIMARY KEY REFERENCES UserInf(uid),
interest VARCHAR(20) NOT NULL);

CREATE TABLE Notifications
(nid INTEGER NOT NULL PRIMARY KEY,
nFrom INTEGER NOT NULL REFERENCES UserInf(uid),
nTo INTEGER NOT NULL REFERENCES UserInf(uid),
ts TIMESTAMP NOT NULL,
text VARCHAR(400));

CREATE TABLE NotifState
(sid INTEGER NOT NULL PRIMARY KEY REFERENCES Notifications(nid),
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
		DELETE from Relationships as r where r.user1 = NEW.user1 AND r.user2 = NEW.user2;
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


INSERT INTO UserInf VALUES(0, 'Anna', 'anna@duke.edu', '1994-03-05', '2153783609', 'Philadelphia', '2015-11-11');
INSERT INTO USERINF VALUES(1, 'Will', 'will@duke.edu', '1996-06-08', '1234567890', 'New York', '2015-12-15');
INSERT INTO USERINF VALUES(2, 'Dan', 'dan@duke.edu', '1987-03-01', '9087654321', 'Boston', '2015-10-11');
INSERT INTO USERINF VALUES(3, 'Kelly', 'kelly@duke.edu', '1987-10-10', '9087987634', 'Boston', '2015-09-11');
INSERT INTO USERINF VALUES(4, 'Emily', 'emily@duke.edu', '1987-05-14', '8765567888', 'Toledo', '2015-12-11');
INSERT INTO USERINF VALUES(5, 'Ian', 'ian@duke.edu', '1990-03-01', '9765123456', 'New York', '2015-10-09');
INSERT INTO USERINF VALUES(6, 'Sarah', 'sarah@duke.edu', '1967-03-01', '9090909090', 'Tampa', '2015-12-11');
INSERT INTO USERINF VALUES(7, 'Sophie', 'sophie@duke.edu', '1997-04-01', '3245234512', 'New York', '2015-4-11');

INSERT INTO UserInterests VALUES(0, 'relationship', 'men', 'books', 'movies', 'sports' );
INSERT INTO UserInterests VALUES(1, 'fwb', 'women', 'guns', 'movies', 'sports' );
INSERT INTO UserInterests VALUES(2, 'relationship', 'women', 'animals', 'netflix', 'classical music' );
INSERT INTO UserInterests VALUES(3, 'fwb', 'men', 'writing', 'movies', 'sports' );
INSERT INTO UserInterests VALUES(4, 'relationship', 'both', 'cooking', 'books', 'netflix' );
INSERT INTO UserInterests VALUES(5, 'fwb', 'both', 'movies', 'classical music', 'ballet' );
INSERT INTO UserInterests VALUES(6, 'relationship', 'both', 'horses', 'movies', 'sports' );
INSERT INTO UserInterests VALUES(7, 'relationship', 'men', 'video games', 'fashion', 'music' );


INSERT INTO Friend VALUES(0,2);
INSERT INTO Friend VALUES(0,5);
INSERT INTO Friend VALUES(0,1);
INSERT INTO Friend VALUES(1,2);
INSERT INTO Friend VALUES(1,3);
INSERT INTO Friend VALUES(1,4);
INSERT INTO Friend VALUES(1,6);
INSERT INTO Friend VALUES(1,7);
INSERT INTO Friend VALUES(2,4);
INSERT INTO Friend VALUES(2,6);
INSERT INTO Friend VALUES(3,5);
INSERT INTO Friend VALUES(4,5);
INSERT INTO Friend VALUES(4,6);
INSERT INTO Friend VALUES(5,7);
INSERT INTO Friend VALUES(6,7);

INSERT INTO Relationships VALUES(0, 1, true);
INSERT INTO Relationships VALUES(2, 4, false);
INSERT INTO Relationships VALUES(3, 5, true);
INSERT INTO Relationships VALUES(3, 6, false);
INSERT INTO Relationships VALUES(4, 1, false);
INSERT INTO Relationships VALUES(5, 7, true);
INSERT INTO Relationships VALUES(6, 7, false);