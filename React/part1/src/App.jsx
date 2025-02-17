import './App.css'

const Tervehdys = () =>{
  return (
    <div>
    <p>Tervehdys!</p>
    <p>Tämä sivu on vain lyhyt testi Reactin aloitukseen. <br></br>
    Olen aloittanut Fullstack open kurssin tänä keväänä, joskin olen ehtinyt vasta osaan 2.</p>
    </div>
  )
}

function App() {
  return (
    <>
      <h1>React testisivu</h1>
      <Tervehdys />
    </>
  )
}

export default App