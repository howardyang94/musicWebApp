const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    let error = ''
    if(await context.prisma.user.findOne({ where: { name: args.name } }) ) {
        error += 'That username is already taken, please select a different one;'
    }
    args.email = args.email.toLowerCase()
    let validEmail = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.[a-z]{2,4}$/i
    if(!validEmail.exec(args.email)) {
        error += 'Please enter a valid email address;'
    } else if(await context.prisma.user.findOne({ where: { email: args.email } }) ) {
        error += 'There already exists an account with that email address;'
    }
    if(error.length > 0) throw new Error(error)
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findOne({ where: { name: args.name } })
    if (!user) {
        throw new Error('User not found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

function post(parent, args, context, info) {
    const userId = getUserId(context)
    const newLink = context.prisma.link.create({
        data: {
            title: args.title,
            artist: args.artist,
            tags: args.tags,
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId} },
        }
    })
    context.pubsub.publish("NEW_LINK", newLink)

    return newLink
}

async function edit(parent, args, context, info) {
    const userId = getUserId(context)
    let link = await context.prisma.link.findOne({where: {id: Number(args.id)}})
    if(!link) {
        console.log(args)
        throw new Error('Link was not found')
    }
    if(link.postedById !== getUserId(context)) {
        throw new Error('You can only modify links that you created')
    }
    link = context.prisma.link.update({ 
        where: {id: Number(args.id)},
        data: {
            title: args.title,
            artist: args.artist,
            url: args.url,
            description: args.description,
            tags: args.tags,
            lastEdited: new Date(Date.now())
        }
    })
    // context.pubsub.publish("NEW_LINK", editLink)
    return link
}

async function remove (parent, args, context, info) {
    const userId = getUserId(context)
    let link = await context.prisma.link.findOne({where: {id: Number(args.id)}})
    if(!link) {
        console.log(args)
        throw new Error('Link was not found')
    }
    if(link.postedById !== userId) {
        throw new Error('You can only delete links that you created')
    }
    // todo: add verification that deleting user is the same as the posting user
    link = await context.prisma.link.delete({ where: {id: Number(args.id)} })
    return link
}

module.exports = {
    signup,
    login,
    post,
    edit,
    remove,
}