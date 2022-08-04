import { useEffect, useState } from 'react';
import { Chart as ChartJS, ChartData, ChartOptions, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from '../data/Nilai.json';
import './Utama.css';

ChartJS.register(...registerables);

export const Utama = () => {
    const MataPelajaran: {[Pengetahuan: string]: {[Pelajaran: string]: any[]}} = {}
    const Pelajaran = ["Agama Islam", "PKN", "Bahasa Indonesia", "MTK Wajib", "Bahasa Inggris", "Sejarah Indonesia", "PJOK", "PKWU", "SBK", "MTK Minat", "Biology", "Physics", "Chemistry", "Sosiology", "Economic", "Rata-rata"];
    const Semester: {[Semester: string]: {[PengKet: string]: number}} = {
        "Semester 1": {Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0},
        "Semester 2": {Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0},
        "Semester 3": {Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0},
        "Semester 4": {Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0},
        "Semester 5": {Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0},
        "Semester 6": {Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0},
    }
    const options: ChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Nilai raport rafi 💀',
            },
        },
        scales: {
            y: {
                max: 100
            }
        },  
        interaction: {
            mode: 'index',
            axis: 'y'
        },
        // hover: {
        //     intersect: false
        // },
    }

    const dataSets: any[] = [];
    const userData: ChartData<"line"> = {
        labels: ["Semster 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"],
        datasets: dataSets,
    }

    const [TipeSemester, setTipeSemester] = useState({});
    
    for(const [pengket, semesterData] of Object.entries(data['Rafi Athallah'])) {
        // console.log(semesterData)
        if(!MataPelajaran.hasOwnProperty(pengket))
            MataPelajaran[pengket] = {};

        for(const pelajaran of Pelajaran) {
            if(!MataPelajaran[pengket].hasOwnProperty(pelajaran))
                MataPelajaran[pengket][pelajaran] = [];
            
            let total = 0
            let bagiBerapa = 0;
            for(const semester of Object.keys(Semester)) {
                const nilai = semesterData[semester as keyof {}][pelajaran];
                MataPelajaran[pengket][pelajaran].push(nilai);
                
                if(nilai > 0) {
                    Semester[semester][pengket] += nilai;
                    total += nilai;

                    bagiBerapa++;
                }
            }
            
            if(pelajaran !== "Rata-rata")
                MataPelajaran[pengket][pelajaran].push(parseFloat((total/bagiBerapa).toFixed(2)));
            else
                MataPelajaran[pengket]["Rata-rata"] = []
        }
    }

    for(const pelajaran of Pelajaran) {
        for(const semester of Object.keys(Semester)) {
            const nilai = data['Rafi Athallah'].Pengetahuan[semester as keyof {}][pelajaran];
            if(nilai > 0) {
                Semester[semester].DiBagiBerapa++;
            }
        }
    }

    for(const PengKetData of Object.values(Semester)) {
        for(const [pengket, Nilai] of Object.entries(PengKetData)) {
            if(pengket === "DiBagiBerapa") continue;
            
            const nilai = (Nilai / PengKetData.DiBagiBerapa);
            MataPelajaran[pengket]["Rata-rata"].push(isNaN(nilai) ? 0 : parseFloat(nilai.toFixed(2)));
        }
    }

    // const a: {[PengKet: string]: {[Pelajaran: string]: any[]}} = {}
    for(const PengKet of ["Pengetahuan", "Keterampilan"]) {
        // for(const pelajaran of Pelajaran) {
        //     if(!a.hasOwnProperty(PengKet))
        //         a[PengKet] = {}

        //     for(let i = 0; i < MataPelajaran[PengKet][pelajaran].length - 2; i++) {
        //         if(!a[PengKet].hasOwnProperty(pelajaran))
        //             a[PengKet][pelajaran] = [];

        //         const nilaiBerikut = MataPelajaran[PengKet][pelajaran][i+1];
        //         a[PengKet][pelajaran].push(<td style={{color: nilaiBerikut < MataPelajaran[PengKet][pelajaran][i] ? "green" : "red"}}>{MataPelajaran[PengKet][pelajaran][i]}</td>)
        //     }
        // }

        dataSets.push({
            label: PengKet,
            data: MataPelajaran[PengKet]["Rata-rata"],
            borderColor: PengKet === "Keterampilan" ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
            backgroundColor: PengKet === "Keterampilan" ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
        })
    }

    const GantiTipe = (value: string) => {
        setTipeSemester(MataPelajaran[value]);
    }
    
    useEffect(() => {
        setTipeSemester(MataPelajaran.Pengetahuan)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // console.log(MataPelajaran);

    return (
        <div className="limiter">
            <div className="container-table100">
                <div className="wrap-table100">
                    <div className="table100">
                        <br />
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <button className='btn btn-primary' style={{marginRight: "20px"}} onClick={() => { document.getElementById('grafik')!.style.display = 'none'; document.getElementById('tabel')!.style.display = 'block' }}>Table</button>
                            <button className='btn btn-primary' style={{marginLeft: "20px"}} onClick={() => { document.getElementById('grafik')!.style.display = 'block'; document.getElementById('tabel')!.style.display = 'none' }}>Grafik</button>
                        </div>
                        <br />
                        <br />
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div id='grafik' style={{display: 'none' ,width: 1600, background: "white", marginRight: "auto"}}>
                                <Line data={userData} options={options as any}/>
                            </div>
                        </div>
                        <div id='tabel'>
                            <select className="form-select" onChange={(e) => GantiTipe(e.target.value)}>
                                <option value="Pengetahuan">Pengetahuan</option>
                                <option value="Keterampilan">Keterampilan</option>
                            </select>
                            <br />
                            <table>
                                <thead>
                                    <tr className="table100-head">
                                        <th className="column1">Mata Pelajaran</th>
                                        {Object.keys(Semester).map((v) => {
                                            return (
                                                <th key={v}>{v}</th>
                                            )
                                        })}
                                        <th>Rata-rata</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Pelajaran.map((pelajaran) => {
                                            return (
                                                <tr>
                                                    <td className='column1'>{pelajaran}</td>
                                                    {TipeSemester[pelajaran as keyof {}] !== undefined &&
                                                        Object.entries(TipeSemester[pelajaran as keyof {}]).map((v: any) => {
                                                            return (
                                                                // <>{pelajaran}</>
                                                                <td>{isNaN(v[1]) ? 0 : v[1]}</td>
                                                            )
                                                        })
                                                    }
                                                    {/* {a.Pengetahuan[pelajaran] !== undefined &&
                                                        a.Pengetahuan[pelajaran].map((v) => {
                                                            return v
                                                        })
                                                    } */}
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}