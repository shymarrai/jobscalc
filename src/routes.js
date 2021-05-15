const express = require("express");
const routes = express.Router()

const Profile = {
  data: {
  name: "Bruno",
  avatar: "http://github.com/shymarrai.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 10,
  "vacation-per-year": 4,
  "value-hour": 76
  },
  controllers: {
    index(req, res){
      return res.render("profile",{ profile: Profile.data })
    },
    update(req, res){
      //req.body  para pegar os dados
      const data = req.body

      //definir quantas semanas tem um ano: 52
      const weeksPerYear = 52

      //remover as semanas de ferias do ano, para pegas quantas semanas tem em 1 mes
      const weeksPerMonth = (weeksPerYear - data['vacation-per-year'] )/ 12

      //quantas horas por semana estou trabalhando
      const weekTotalHours = data['hours-per-day'] * data['days-per-week']

      //total de horas trabalhadas no mes
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      //qual será o valor da minha hora?
      data['value-hour'] = data['monthly-budget'] / monthlyTotalHours

      Profile.data = data

      return res.redirect('/profile')
      
    },
  }

}

const Job = {
  data: [
      {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2 ,
      "total-hours": 1,
      created_at : Date.now(),
      budget: 4500
      },
      {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now(),
        budget: 4500
        },
    
    
    ],
  controllers: {
    index(req, res) {

      const updatedJobs = Job.data.map((job) => {
        //ajustes no job
        //calculo de tempo restante
        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'
        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data['value-hour'])
    
        }
    
      })
    
    
      return res.render("index", {jobs: updatedJobs })
      
    },



    save(req, res){

      const lastId = Job.data[Job.data.length - 1]?.id || 0;
      Job.data.push({
          id: lastId + 1,
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
    show(req,res){
      const id = req.params.id
      
      const job = Job.data.find(job => Number(job.id) === Number(id))
      if(!job){
        return res.send('Job not found!')
      }
      
      job.budget = Job.services.calculateBudget(job, Profile.data['value-hour'])
      return res.render('job-edit', { job})
    },
    update(req,res){
      const id = req.params.id
      
      const job = Job.data.find(job => Number(job.id) === Number(id))
      if(!job){
        return res.send('Job not found!')
      }
      
      const updatedJob = {
        ...job,
        name: req.body.name,
        'total-hours': req.body['total-hours'],
        'daily-hours': req.body['daily-hours'],

      }
      Job.data = Job.data.map(job => {
        if(Number(job.id) === Number(id)){
          job = updatedJob
        }
        return job
      })
      res.redirect('/job/' + id)
      
    },
    delete(req,res){
      const id = req.params.id

      Job.data = Job.data.filter(job => Number(job.id) !== Number(id))

      return res.redirect('/')
    }
  },


  services: {
    remainingDays(job){
      const restOfDays = (job['total-hours'] / job['daily-hours']).toFixed() //toFixed é semelhante ao Math.Round()
    
      const createdDate = new Date(job.created_at)
      const dueDay = createdDate.getDate() + Number(restOfDays)
      const dueDateInMS = createdDate.setDate(dueDay)
    
      const timeDiffInMs = dueDateInMS - Date.now()
      //transformar milliseconds in days
      const dayInMs = 1000 * 60 * 60 * 24
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)
    
      //restam x dias
      return dayDiff
    },
    calculateBudget: (job, valueHour) => valueHour * job['total-hours'],
  }
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)



module.exports = routes