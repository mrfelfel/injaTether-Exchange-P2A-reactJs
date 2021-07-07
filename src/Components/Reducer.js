const initialState = {
    count: 1,
    name: 'name'
}

function reducer(state = initialState, action) {

   // console.log(state)
//   console.log(action)

    if (action.type === 'INCREMENT') {
        return {
            count: action.text + 1,
        }
    } else if (action.type === 'ADDNAME') {
        return {
            name: action.text,
        }
    } else {
        return state
    }

    /* switch (action.type) {
         case 'INCREMENT' :
             return {
                 count: state.count + 1,
             }
             break;
         case 'ADDNAME' :
              return {
                  name: state.name,
              }
              break;
          default:
              return state
      }*/


}

export default reducer