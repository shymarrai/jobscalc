module.exports = {
  remainingDays(job){
    const restOfDays = (job['total-hours'] / job['daily-hours']).toFixed() //toFixed é semelhante ao Math.Round()
  
    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(restOfDays)
    const dueDateInMS = createdDate.setDate(dueDay)
  
    const timeDiffInMs = dueDateInMS - Date.now()
    //transformar milliseconds in days
    const dayInMs = 1000 * 60 * 60 * 24
    const dayDiff = Math.ceil(timeDiffInMs / dayInMs)
  
    //restam x dias
    return dayDiff
  },
  calculateBudget: (job, valueHour) => valueHour * job['total-hours'],
}