const prisma = require("../src/db");
const md5 = require('md5');

// returns the profile associated with the email and password
// returns empty list if no profile found => email or password incorrect
async function getProfile(email, password) {
    return await prisma.profile.findFirst({
        where: {
            AND: {
                email: email,
                password_hash: md5(password)
            },
        }
    });
};

// to be used only for development purposes
// (some passwords in db are unhashed so if you want to log in
//  with those profiles, use this function)
async function getProfileUnhashed(email, password) {
    return await prisma.profile.findFirst({
        where: {
            AND: {
                email: email,
                password_hash: password
            },
        }
    });
}

async function getProfileByEmail(email) {
 return await prisma.profile.findFirst({
        where: {
            AND: {
                email: email,
            },
        }
    });
};

async function createProfile(firstName, lastName, email, password, phoneNumber) {
    return await prisma.profile.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            password_hash: md5(password)
        }
    });
};

module.exports = {
    getProfile,
    getProfileByEmail,
    getProfileUnhashed,
    createProfile
}
