import { Clock, Droplets, Eye, Sunrise, Sunset, Thermometer, ThermometerSun, Tornado, Wind, WindArrowDown } from "lucide-react";
import SearchLocation from "./search-location";
import { useEffect, useState } from "react";



const Layout = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [weatherInfo, setWeatherInfo] = useState({
    lat: 0,
    lon: 0,
    weather: "",
    desc: "",
    temp: 0,
    feels_like: 0,
    min_temp: 0,
    max_temp: 0,
    pressure: 0,
    humidity: 0,
    sea_level: 0,
    grnd_level: 0,
    visibility: 0,
    wind_spd: 0,
    wind_deg: 0,
    gust: 0,
    clouds_all: 0,
    city: "",
    sunrise: Date(),
    sunset: Date(),
    date: Date(),
    icon: ""
  });


  interface forecastProps{
    temp: number,
    weather: string,
    desc: string,
    date: string,
    time: string,
    icon: string
  }
  const [forecast, setForecast] = useState<forecastProps[]>([]);
  const [dailyForecast, setDailyForecast] = useState<forecastProps[]>([]);
  
  const handleCoordinateChange = async(lat:number, lon: number) => {
    await getWeatherInfo(lat,lon);
    await getForecast(lat, lon);
  }

  const key = import.meta.env.VITE_WEATHER_API_KEY;
  

  const getWeatherInfo = async(lat:number,lon:number,) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);

      const data = await res.json();
      
      setWeatherInfo({
        lat: data.coord.lat,
        lon: data.coord.lon,
        weather: data.weather[0].main,
        desc: data.weather[0].description,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        min_temp: data.main.temp_min,
        max_temp: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        sea_level: data.main.sea_level,
        grnd_level: data.main.grnd_level,
        visibility: data.visibility,
        wind_spd: data.wind.speed,
        wind_deg: data.wind.deg,
        gust: data.wind.gust,
        clouds_all: data.clouds.all,
        city: data.name,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        date: new Date(data.dt * 1000).toLocaleDateString(),
        icon: data.weather[0].icon
      });

    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const getForecast = async(lat:number, lon:number) => {
    try {
      const req = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=d5921e5819c2e6b30573e1cd03b557a2&units=metric`);

      const data = await req.json();

      const temp:forecastProps[] = [];
      data.list.map((l:any,id:number) => {
        if(id <= 4){
          const item = {
            date: new Date(l.dt * 1000).toLocaleDateString(),
            time: new Date(l.dt * 1000).toLocaleTimeString(),
            temp: l.main.temp,
            weather: l.weather[0].main,
            desc: l.weather[0].description,
            icon: l.weather[0].icon
          };
          temp.push(item);
        }
      });
      setForecast(temp);

      const addedDates = new Set();

      const dailyTemp:forecastProps[] = [];
      
      data.list.forEach((entry: any) => {
        const [date, time] = entry.dt_txt.split(' ');
        if (time === '12:00:00' && !addedDates.has(date)) {
          dailyTemp.push({
            date,
            temp: entry.main.temp,
            weather: entry.weather[0].main,
            icon: entry.weather[0].icon,
            desc: entry.weather[0].description,
            time: time
          });
          addedDates.add(date);
        }
      });

      setDailyForecast(dailyTemp)

      
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async(position) => {
      setError(false);
      setLoading(true);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      await getWeatherInfo(lat, lon); 
      await getForecast(lat,lon);
      setLoading(false);
    },(error) => {
      console.log(error);
      setError(true);
    });
  },[]);



  if(loading) return (
    <div className="h-svh w-full flex items-center justify-center gap-x-3 relative">
      <svg aria-hidden="true" className="inline w-60 h-60 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </div>
  );

  if(error){
    return (
      <div className="h-svh max-w-svw flex flex-col justify-center gap-y-4">
        <h1 className="text-4xl lg:text-6xl text-center">
          There is an Error fetching data from OPEN WEATHER API!!!
        </h1>
        <h1 className="text-4xl text-center">
          Try again Later!!!
        </h1>
        <p className="text-2xl text-center">Check browser console for detailed error.</p>
      </div>
    )
  }


  return (
    <div className="min-h-svh 2xl:px-25 py-5 bg-[url(/background.jpg)] bg-cover bg-no-repeat bg-center">
      <div className="flex flex-col 2xl:flex-row items-center justify-center h-full rounded-xl bg-black/34 p-2 2xl:p-6 gap-y-8">
        
        <div className="flex-1 h-full flex items-center flex-col gap-y-2 justify-between">
          <SearchLocation latitude={weatherInfo.lat} longitude={weatherInfo.lon}  handleCoordinateChange={handleCoordinateChange}/>
          {/* Weather Info */}
          <div 
            className="flex flex-col items-center justify-center bg-blue-950/90 rounded-xl overflow-hidden gap-y-6 py-6"
          >
            <div className="flex items-center flex-col gap-y-2">
              <h1 className="text-5xl font-figtree text-center">{weatherInfo.temp}&deg; at {weatherInfo.city}</h1>
              <h3 className="text-4xl font-figtree flex items-center">
                <img src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`} alt="" className="h-20 w-20"/>
                {weatherInfo.weather}
              </h3>
              <p className="text-lg text-center px-2">{weatherInfo.desc}</p>
            </div>

            <div className="flex flex-wrap gap-4 items-stretch justify-center">
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Sunrise />
                  Sunrise
                </span>
                <span className="text-xl">{weatherInfo.sunrise}</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Sunset />
                  Sunset
                </span>
                <span className="text-xl">{weatherInfo.sunset}</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Thermometer />
                  TEMP MIN
                </span>
                <span className="text-xl">{weatherInfo.min_temp}&deg;</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <ThermometerSun />
                  TEMP MAX
                </span>
                <span className="text-xl">{weatherInfo.max_temp}&deg;</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <ThermometerSun />
                  FEELS LIKE
                </span>
                <span className="text-xl">{weatherInfo.feels_like}&deg;</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Tornado />
                  Pressure
                </span>
                <span className="text-xl">{weatherInfo.pressure}hPa</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Eye />
                  VISIBILITY
                </span>
                <span className="text-xl">{weatherInfo.visibility}mt</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Droplets />
                  HUMIDITY
                </span>
                <span className="text-xl">{weatherInfo.humidity}%</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <Wind />
                  Wind speed
                </span>
                <span className="text-xl">{weatherInfo.wind_spd}m/s</span>
              </div>
              <div className="w-72 bg-white/15 rounded-xl p-4 flex xl:flex-col justify-between">
                <span className="flex gap-x-2 text-xl">
                  <WindArrowDown />
                  Wind deg
                </span>
                <span className="text-xl">{weatherInfo.wind_deg}&deg;</span>
              </div>
            </div>
          </div>
        </div>



        <div className="h-full w-full flex-1 xl:p-6 flex flex-col items-center justify-center gap-y-6">
          <div className="w-full p-6 bg-black/70 backdrop-blur-[1px] rounded-xl max-w-svw">
            <span className="flex gap-x-4">
              <Clock />
              HOURLY FORECAST
            </span>
            <hr className="my-4 border-t-2 bg-slate-400 rounded-full"/>
            <div className="flex flex-wrap xl:flex-nowrap xl:flex-row gap-x-6 gap-y-4 items-center justify-center">
              {forecast.map((f,id) => (
                <div key={id} className="flex flex-1 xl:flex-col items-center justify-between xl:justify-center p-6 gap-y-2 rounded-xl bg-white/25">
                  <div className="space-y-2 flex items-center flex-col">
                    <p>{f.date}</p>
                    <p>{f.time}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl">{f.temp}&deg;</span>
                    <div className="flex items-center xl:flex-col">
                      <img src={`https://openweathermap.org/img/wn/${f.icon}@2x.png`} alt="" className="h-20 w-20"/>
                      <p>{f.weather}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full p-6 bg-black/70 backdrop-blur-[1px] rounded-xl max-w-svw">
            <span className="flex gap-x-4">
              <Clock />
              5-Day FORECAST
            </span>
            <hr className="my-4 border-t-2 bg-slate-400 rounded-full"/>
            <div className="flex flex-wrap xl:flex-nowrap xl:flex-row gap-x-6 gap-y-4 items-center justify-center">
              {dailyForecast.map((f,id) => (
                <div key={id} className="flex flex-1 flex-col items-center justify-between xl:justify-center p-6 gap-y-2 rounded-xl bg-white/25 w-full">
                  <p className="w-full text-center">{f.date}</p>
                  <div className="flex flex-col items-center justify-center w-full gap-4">
                    <span className="text-4xl">{f.temp}&deg;</span>
                    <p>{f.weather}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  )
};

export default Layout;
