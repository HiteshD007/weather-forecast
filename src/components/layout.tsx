import { Clock, Droplets, Eye, Sunrise, Sunset, Thermometer, ThermometerSun, Tornado, Wind, WindArrowDown } from "lucide-react";
import SearchLocation from "./search-location";
import { useEffect, useState } from "react";



const Layout = () => {

  const [loading, setLoading] = useState(false);

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

  const key = import.meta.env.WEATHER_API_KEY;

  const getWeatherInfo = async(lat:number,lon:number,) => {
    setLoading(true);
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

      setLoading(false);

    } catch (error) {
      console.log(error);
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
    }
  }

  


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async(position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      await getWeatherInfo(lat, lon); 
      await getForecast(lat,lon);
    },(error) => {
      console.log(error);
    });
  },[]);



  if(loading) return null;


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
