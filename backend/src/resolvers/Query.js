async function feed(parent, args, context, info) {
    let where = {AND : []}
    if(args.filter) {
        where.OR =  [
                { description: { contains: args.filter } },
                { title: { contains: args.filter } },
                { artist: { contains: args.filter } },
                { tags: { contains: args.filter } },
            ]
    }
    if(args.id) {
        where.id = Number(args.id)
    } 
    if(args.title) {
        where.AND.push({title: {contains: args.title}})
    }
    if(args.artist) {
        where.AND.push({artist: {contains: args.artist}})
    }
    if(args.tags) {
        if (args.match == 'all'){
            for(let tag of args.tags.split(' ')) {
                where.AND.push({tags: {contains: tag}})
            }
        // } else if(args.match == 'not') { // To be implemented
        } else {
            const or = []
            for(let tag of args.tags.split(' ')) {
                or.push({tags: {contains: tag}})
            }
            if(!where.OR) {
                where.OR = or
            } else {
                where.OR = where.OR.concat(or)
            }
        }
    }
    if(args.description) {
        where.AND.push({description: {contains: args.description}})
    }
    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy || {id: 'desc'}
        // default order by newest on top
    })
    const count = await context.prisma.link.count({ where })
    return {
        links,
        count,   
    }
}
async function findLinkId(parent, args, context, info) {
    const link = context.prisma.link.findOne( {where: {id: Number(args.id)} })

    return link
}
module.exports = {
    feed,
    findLinkId,
}