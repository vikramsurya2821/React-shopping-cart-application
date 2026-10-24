import "./Banner.css";

function Banner() {

  return (
    <section className="banner">

      <div>

        <h1>
          Big Billion Sale 🎉
        </h1>

        <p>
          Amazing offers on your favourite products
        </p>

        <button>
          Shop Now
        </button>

      </div>

      <div className="offer">

        <span>UP TO</span>

        <strong>70%</strong>

        <span>OFF</span>

      </div>

    </section>
  );
}

export default Banner;