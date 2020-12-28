function timeDifference(current, previous) {
    const milliSecondsPerMinute = 60000
    const milliSecondsPerHour = milliSecondsPerMinute * 60
    const milliSecondsPerDay = milliSecondsPerHour * 24
    const milliSecondsPerMonth = milliSecondsPerDay * 30
    const milliSecondsPerYear = milliSecondsPerDay * 365
  
    const elapsed = current - previous

    if (elapsed < milliSecondsPerMinute / 3) {
      return 'just now'
    }
    if (elapsed < milliSecondsPerMinute) {
      return 'less than 1 min ago'
    } 
    let str = '', num
    if (elapsed < milliSecondsPerHour) {
      num = Math.round(elapsed / milliSecondsPerMinute)
      str += num + ' minute'
    } else if (elapsed < milliSecondsPerDay) {
      num = Math.round(elapsed / milliSecondsPerHour)
      str += num + ' hour'
    } else if (elapsed < milliSecondsPerMonth) {
      num = Math.round(elapsed / milliSecondsPerDay)
      str += num + ' day'
    } else if (elapsed < milliSecondsPerYear) {
      num = Math.round(elapsed / milliSecondsPerMonth)
      str += num + ' month'
    } else {
      num = Math.round(elapsed / milliSecondsPerYear)
      str += num + ' year'
    }
    if(num > 1) {
      // num will not be less than 1
      str += 's'
    }
    return str + ' ago'
  }
  
  export function timeDifferenceForDate(date) {
    return timeDifference(new Date().getTime(), date)
  }