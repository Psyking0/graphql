export const PROFILE_QUERIES = {
  // Basic user info and XP data
  basicProfile: `
    {
      user { 
        id 
        login 
      }
      transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
        amount 
        createdAt
      }
    }
  `,

  // Detailed user profile with all information
  detailedProfile: `
    {
      user {
        login
        firstName
        lastName
        email
        phone: attrs(path:"tel")
        campus
        totalUp
        totalDown
        totalUpBonus
        auditRatio
        conditionsAccepted: attrs(path:"general-conditionsAccepted")
        singServicesAccepted: attrs(path:"using-our-servicesAccepted")
      }
      level: transaction(
        where: {
          _and: [
            { type: { _eq: "level" } },
            { event: { object: { name: { _eq: "Module" } } } }
          ]
        }
        order_by: { amount: desc }
        limit: 1
      ) {
        amount
      }
      xp: transaction_aggregate(
        where: {
          _and: [
            {type: {_like: "xp"}}, 
            {
              _or: [
                {originEventId: {_eq: 41}},
                {path: {_ilike: "/oujda/module/checkpoint/%"}},
                {path: {_ilike: "/oujda/module/piscine-js"}}
              ]
            }
          ]
        }
      ) { 
        aggregate {
          sum {
            amount
          }
        }
      }
      projects: user {
        transactions(
          where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
          order_by: {createdAt: desc}
        ) {
          object {
            name
            type
            progresses {
              group {
                members {
                  userLogin
                }
              }
            }
          }
          amount
          createdAt
        }
      }
    }
  `,

  // XP transactions for charts
  xpTransactions: `
    {
      transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
        amount 
        createdAt
        path
      }
    }
  `
}; 