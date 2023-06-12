import { useEffect, useState } from 'react';
import { Chart as ChartJS, ChartData, ChartDataset, ChartOptions, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from '../data/Nilai Rafi.json';
import './Utama.css';

ChartJS.register(...registerables);

export const Utama = () => {
    const MataPelajaran: { [Pengetahuan: string]: { [Pelajaran: string]: any[] } } = {}
    const Pelajaran = ["Agama Islam", "Politics", "Indonesia Language", "MTK Wajib", "English", "History", "PJOK", "PKWU", "SBK", "MTK Minat", "Biology", "Physics", "Chemistry", "Rata-rata"];
    const Semester: { [Semester: string]: { [PengKet: string]: number } } = {
        "Semester 1": { Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0 },
        "Semester 2": { Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0 },
        "Semester 3": { Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0 },
        "Semester 4": { Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0 },
        "Semester 5": { Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0 },
        "Semester 6": { Keterampilan: 0, Pengetahuan: 0, DiBagiBerapa: 0 },
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
                max: 100,
                min: 50,
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

    // const dataSets: any[] = [];
    const [TipePengetahuan, setTipePengetahuan] = useState<"Keterampilan" | "Pengetahuan">("Pengetahuan");
    const [TipeData, setTipeData] = useState<"Table" | "Grafik">("Table");
    const [dataSets, setDataSets] = useState<{ Pengetahuan: ChartDataset<"line">[], Keterampilan: ChartDataset<"line">[] }>({
        Pengetahuan: [],
        Keterampilan: []
    })
    const userData: ChartData<"line"> = {
        labels: ["Semster 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"],
        datasets: dataSets as any
    }

    const [TipeSemester, setTipeSemester] = useState({});

    for (const [pengket, semesterData] of Object.entries(data['Rafi Athallah'])) {
        // console.log(semesterData)
        if (!MataPelajaran.hasOwnProperty(pengket))
            MataPelajaran[pengket] = {};

        for (const pelajaran of Pelajaran) {
            if (!MataPelajaran[pengket].hasOwnProperty(pelajaran))
                MataPelajaran[pengket][pelajaran] = [];

            let total = 0
            let bagiBerapa = 0;
            for (const semester of Object.keys(Semester)) {
                const nilai = semesterData[semester as keyof {}][pelajaran];
                MataPelajaran[pengket][pelajaran].push(nilai);

                if (nilai > 0) {
                    Semester[semester][pengket] += nilai;
                    total += nilai;

                    bagiBerapa++;
                }
            }

            if (pelajaran !== "Rata-rata") {
                MataPelajaran[pengket][pelajaran].push(parseFloat((total / bagiBerapa).toFixed(2)));
            } else {
                MataPelajaran[pengket]["Rata-rata"] = []
            }
        }
    }

    for (const pengket of Object.keys(data['Rafi Athallah'])) {
        let total = 0;
        let bagiBerapa = 0;
        for (const pelajaran of Pelajaran) {
            if (pelajaran === "Rata-rata") continue;
            total += MataPelajaran[pengket][pelajaran].at(-1);
            bagiBerapa++;
        }

        MataPelajaran[pengket]["Rata-rata"][MataPelajaran[pengket]["Rata-rata"].length - 1] = parseFloat((total / bagiBerapa).toFixed(2));
    }

    for (const pelajaran of Pelajaran) {
        for (const semester of Object.keys(Semester)) {
            const nilai = data['Rafi Athallah'].Pengetahuan[semester as keyof {}][pelajaran];
            if (nilai > 0) {
                Semester[semester].DiBagiBerapa++;
            }
        }
    }

    const WARNA = ["#BF7AB7", "#23F2F6", "#9BCE5E", "#DC5E66", "#1038EE", "#2C77FD", "#B0AD03", "#6FFDA8", "#A6F999", "#A6F999", "#E9D55A", "#302945", "#573628", "#7FE6FC", "#B09EE6", "#7E80EB"];
    const dataline: { Pengetahuan: ChartDataset<"line">[], Keterampilan: ChartDataset<"line">[] } = { Pengetahuan: [], Keterampilan: [] }
    let ind = 0;
    for (const PengKet of ["Pengetahuan", "Keterampilan"]) {
        for (const pelajaran of Pelajaran) {
            dataline[PengKet as keyof typeof dataline].push({
                label: pelajaran,
                data: MataPelajaran[PengKet][pelajaran],
                borderColor: WARNA[ind],
                backgroundColor: WARNA[ind]
            })

            ind++;
        }
        ind = 0;
    }

    for (const PengKetData of Object.values(Semester)) {
        for (const [pengket, Nilai] of Object.entries(PengKetData)) {
            if (pengket === "DiBagiBerapa") continue;

            const nilai = (Nilai / PengKetData.DiBagiBerapa);
            MataPelajaran[pengket]["Rata-rata"].push(isNaN(nilai) ? 0 : parseFloat(nilai.toFixed(2)));
        }
    }

    const GantiTipe = (value: string) => {
        setTipeSemester(MataPelajaran[value]);
    }

    useEffect(() => {
        setTipeSemester(MataPelajaran.Pengetahuan);
        setDataSets(dataline);
        userData.datasets = dataline.Pengetahuan;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="limiter">
            <div className="container-table100">
                <div className="wrap-table100">
                    <div className="table100">
                        <br />
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {/* <button className='btn btn-primary' style={{ marginRight: "20px" }} onClick={() => { document.getElementById('grafik')!.style.display = 'none'; document.getElementById('tabel')!.style.display = 'block' }}>Table</button>
                            <button className='btn btn-primary' style={{ marginLeft: "20px" }} onClick={() => { document.getElementById('grafik')!.style.display = 'block'; document.getElementById('tabel')!.style.display = 'none' }}>Grafik</button> */}
                            <button className='btn btn-primary' style={{ marginRight: "20px" }} onClick={() => { setTipeData("Table") }}>Table</button>
                            <button className='btn btn-primary' style={{ marginLeft: "20px" }} onClick={() => { setTipeData("Grafik") }}>Grafik</button>
                        </div>
                        <br />
                        <br />
                        <select className="form-select" onChange={(e) => { GantiTipe(e.target.value); setTipePengetahuan(e.target.value as "Pengetahuan" | "Keterampilan") }}>
                            <option value="Pengetahuan">Pengetahuan</option>
                            <option value="Keterampilan">Keterampilan</option>
                        </select>
                        {TipeData === "Table" &&
                            <div id='tabel'>
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
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                        {TipeData === "Grafik" &&
                            <div id='grafik'>
                                <br />
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ width: 1600, marginRight: "auto" }}>
                                        <Line data={{ labels: ["Semester1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"], datasets: dataSets[TipePengetahuan] }} options={options as any} style={{ background: "white" }} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}