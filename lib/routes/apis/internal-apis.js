Router.map(function() {
    this.route("searchExercises", {
      path: "/search/exercises/",
      where: "server",
      layout: null,
      action() {
        const { keyword } = this.request.query
        if ( !keyword ) {
          this.response.writeHead( 500, {
            "Content-Type": "application/json"
          })
          this.response.end( "bad request" )
        }
  
        const foundExercises = Exercises.find(
          { name: 
            {
              $regex: keyword,
              $options: "i"
            }
          },
          {
            fields: {
              _id: 1,
              name: 1,
              type: 1,
              counter: 1
            }
          }
        ).fetch()
  
        this.response.writeHead(200, {
          "Content-Type": "application/json"
        })
        this.response.end(
          JSON.stringify({
            exercise: foundExercises
          })
        )
      }
    })
  })

  Router.map(function() {
    this.route("searchUserExercises", {
      path: "/search/userExercises/",
      where: "server",
      layout: null,
      action() {
        const { keyword } = this.request.query
        if ( !keyword ) {
          this.response.writeHead( 500, {
            "Content-Type": "application/json"
          })
          this.response.end( "bad request" )
        }
  
        const foundExercises = UsersExercises.find(
          { name: 
            {
              $regex: keyword,
              $options: "i"
            }
          },
          {
            fields: {
              _id: 1,
              name: 1,
              userID: 1
            }
          }
        ).fetch()
  
        this.response.writeHead(200, {
          "Content-Type": "application/json"
        })
        this.response.end(
          JSON.stringify({
            exercise: foundExercises
          })
        )
      }
    })
  })

  Router.map(function() {
    this.route("searchFriends", {
      path: "/search/friends/",
      where: "server",
      layout: null,
      action() {
        const { keyword } = this.request.query
        if ( !keyword ) {
          this.response.writeHead( 500, {
            "Content-Type": "application/json"
          })
          this.response.end( "bad request" )
        }
  
        const foundFriends = Meteor.users.find(
          { username: 
            {
              $regex: keyword,
              $options: "i"
            }
          },
          {
            fields: {
              _id: 1,
              username: 1,
              profile: 1
            }
          }
        ).fetch()
  
        this.response.writeHead(200, {
          "Content-Type": "application/json"
        })
        this.response.end(
          JSON.stringify({
            friend: foundFriends
          })
        )
      }
    })
  })