export default function (num=10){
  let arr = []
  for(var i=0; i<num; i++){
    arr.push(Math.ceil(Math.random(1)*num))
  }
  return {
    arr: arr,
    sort_arr: arr.sort((a,b)=>{return a-b})
  }
}