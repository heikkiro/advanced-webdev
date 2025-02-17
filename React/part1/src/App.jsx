import './App.css'

const Tervehdys = () =>{
  return (
    <div>
    <p>Tervehdys!</p>
    <p>Tämä sivu on vain lyhyt testi Reactin aloitukseen. <br></br>
    Olen aloittanut Fullstack open kurssin tänä keväänä, joskin olen ehtinyt vasta osan 2 tehtävien pariin (tilanne 17.2.2025).<br></br>
    Linkki Fullstack repositoriooni <a href='https://github.com/heikkiro/fullstackopen-return-repo' target='_blank'> Heikin Fullstack Open-palautusrepositorio</a> . </p>
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