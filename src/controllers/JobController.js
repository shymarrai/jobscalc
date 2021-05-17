const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')




module.exports = {
  async save(req, res){

    await Job.create({
      name: req.body.name,
      "daily-hours":req.body['daily-hours'] ,
      "total-hours": req.body['total-hours'],
      created_at : Date.now()

  })

  
    return res.redirect('/') 
  },


  create(req,res){
    res.render("job")
  },
  async show(req,res){
    let jobs = await Job.get()
    let profile = await Profile.get()

    const id = req.params.id
    
    const job = jobs.find(job => Number(job.id) === Number(id))
    if(!job){
      return res.send('Job not found!')
    }
    
    const budget = JobUtils.calculateBudget(job, profile['value-hour'])
    return res.render('job-edit', { job, budget})
  },
  async update(req,res){
    
    const id = req.params.id
    
    const updatedJob = {
      name: req.body.name,
      'total-hours': req.body['total-hours'],
      'daily-hours': req.body['daily-hours'],
    }

    await Job.update(updatedJob, id)
    
    res.redirect('/job/' + id)
    
  },
  async delete(req,res){
    
    const id = req.params.id
    
    await Job.delete(id)

    return res.redirect('/')
  }
}