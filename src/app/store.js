import {createStore,combineReducers} from "redux"
const preview = (state = [], action) => {
    switch (action.type) {
        case "GET_FILEPATHS":
            return action.filePaths.map(filePath => {
                return {filePath}
            })
        case "GET_DATA":
            return state.map(({filePath}, index) => {
                return {filePath, data: JSON.parse(action.data[index]),}
            })
        default:
            return state
    }
}

const threshold=(state=0,action)=>{
    switch (action.type) {
        case "GET_THRESHOLD":
            return action.value
        default:
        return state
    }
}

const bg=(state=true,action)=>{
    switch (action.type) {
        case "GET_BG":
            return !state
        default:
        return state
    }
}

let store=combineReducers({preview,threshold,bg})

export default createStore(store)
