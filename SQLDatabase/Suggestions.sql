--input user as "u1id"

WITH
u1int (interests) AS
	(SELECT interest
	FROM UserInterests
	WHERE UserInterests.uiid = 2),
u1info (uid1, name1, gender1, commitLevel1, interestedIn1) AS
	(SELECT uid, name, gender, commitLevel, interestedIn
	FROM UserInf
	WHERE UserInf.uid = 2),
compatibleUsers (uid2, name2, gender2, commitLevel2, interestedIn2) AS
	(SELECT uid, name, gender, commitLevel, interestedIn
	FROM UserInf, u1info
	WHERE
		((UserInf.gender = u1info.interestedIn1
		AND (UserInf.interestedIn = u1info.gender1 OR UserInf.interestedIn = 'Both'))
		OR
		(u1info.gender1 = UserInf.interestedIn
		AND (u1info.interestedIn1 = UserInf.gender OR u1info.interestedIn1 = 'Both'))
		OR
		(UserInf.interestedIn = 'Both' AND u1info.interestedIn1 = 'Both'))
		AND
		UserInf.commitLevel = u1info.commitlevel1)

(SELECT uid2, name2 FROM compatibleUsers
WHERE
	(SELECT COUNT(*)
	FROM
		((SELECT interest
		FROM UserInterests
		WHERE compatibleUsers.uid2 = UserInterests.uiid)
		INTERSECT
		(SELECT * FROM u1int)) AS T)
	= 3
)
UNION
(SELECT uid2, name2 FROM compatibleUsers
WHERE
	(SELECT COUNT(*)
	FROM
		((SELECT interest
		FROM UserInterests
		WHERE compatibleUsers.uid2 = UserInterests.uiid)
		INTERSECT
		(SELECT * FROM u1int)) AS T)
	= 2
)
UNION
(SELECT uid2, name2 FROM compatibleUsers
WHERE
	(SELECT COUNT(*)
	FROM
		((SELECT interest
		FROM UserInterests
		WHERE compatibleUsers.uid2 = UserInterests.uiid)
		INTERSECT
		(SELECT * FROM u1int)) AS T)
	= 1
);