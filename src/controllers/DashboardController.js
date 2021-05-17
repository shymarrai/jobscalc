const JobUtils = require('../utils/JobUtils')
const Job = require('../model/Job')
const Profile = require('../model/Profile')



module.exports = {
  async index(req, res) {
    let jobs = await Job.get()
    let profile = await Profile.get()
    
    let jobTotalHours = 0


    const statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }



  const updatedJobs = jobs.map((job) => {
    //ajustes no job
    //calculo de tempo restante
    const remaining = JobUtils.remainingDays(job)
    const status = remaining <= 0 ? 'done' : 'progress'

    statusCount[status] += 1

    if(status != 'done'){
      jobTotalHours += Number(job['daily-hours'])
    }
    


    return {
      ...job,
      remaining,
      status,
      budget: JobUtils.calculateBudget(job, profile['value-hour'])

    }
  })

  


  let freeHours = Number(profile['hours-per-day']) - jobTotalHours


  return res.render("index", {jobs: updatedJobs, profile, statusCount, freeHours })
  
}}