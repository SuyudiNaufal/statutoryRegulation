'use client'
// import CSS
import Link from "next/link"
import styles from "./body.module.css"
import { useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react"
import { useState, useEffect } from "react";

export default function Body() {
    const [statutories, setStatutories] = useState<any[]>([])
    const searchParam = useSearchParams();
    const supabase = createClientComponentClient();
    // ambil statutories
    async function getStatutories() {
        const { data: statutories, error } = await supabase
            .from('statutories')
            .select('*')
        if (!statutories) {
            return
        }
        setStatutories(statutories as any)
    }
    React.useEffect(() => { getStatutories() }, []
        // [] only run once
    )
    const bagian = searchParam.get("bagian");
    return (
        <div className={styles.bodyContainer}>
            <div className={styles.bodyLeft}>
                <div className={styles.bodyLeftTop}>
                    <div className={styles.bodySearchBar}>
                        <input type="text" placeholder="Search Peraturan" className={styles.searchBar} name="searchBar"></input>
                        <button className={styles.buttonSearch}>Search</button>
                    </div>
                </div>
                <div className={styles.bodyLeftBottom}>

                    <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                        <summary className={styles.treeNavTitle}> Undang-Undang</summary>

                        <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                            <summary className={styles.treeNavTitle}>Undang-Undang 17 Tahun 2008</summary>

                            {/* BAB 1 */}
                            <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                                <summary className={styles.treeNavTitle}>BAB I</summary>
                            </details>

                            {/* BAB 2 */}
                            <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                                <summary className={styles.treeNavTitle}>BAB II</summary>
                            </details>
                            {/* BAB 3 */}
                            <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                                <summary className={styles.treeNavTitle}>BAB III</summary>
                            </details>

                            {/* BAB 4 */}
                            <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                                <summary className={styles.treeNavTitle}>BAB IV</summary>
                            </details>

                            {/* BAB 5 */}
                            <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                                <summary className={styles.treeNavTitle}>BAB V</summary>

                                <div className={styles.treeNavTitleDiv}>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian1">Bagian 1</Link>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian2">Bagian 2</Link>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian3">Bagian 3</Link><Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian4">Bagian 4</Link><Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian5">Bagian 5</Link>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian6">Bagian 6</Link><Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian7">Bagian 7</Link><Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian8">Bagian 8</Link><Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian9">Bagian 9</Link><Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian10">Bagian 10</Link>
                                </div>
                            </details>
                        </details>
                    </details>
                </div>
            </div>
            <div className={styles.bodyRight}>
                <div className={styles.bodyRightTop}>
                    <h4>{
                        statutories[0]?.statutory_title
                    }</h4>
                </div>
                <div className={styles.bodyRightBottom}>

                    {/* BAB 5 Bagian 1 */}
                    <h1>Bagian 1</h1>
                    <h2>Jenis Angkutan di Perairan</h2>


                    <p>Pasal 6</p>
                    <p>Jenis angkutan di perairan terdiri atas:
                    </p>
                    <ol>
                        <li>a. Angkutan laut;</li>
                        <li>b. Angkutan sungai dan danau; dan</li>
                        <li>c. Angkutan penyeberangan.</li>
                    </ol>

                    {/* BAB 5 Bagian 2 */}
                    <h1>Bagian Kedua</h1>
                    <h2>Angkutan Laut</h2>

                    <h3>Paragraf 1</h3>
                    <h4>Jenis Angkutan Laut</h4>

                    <p>Pasal 7</p>
                    <ol>
                        <li>a. Angkutan laut dalam negeri;</li>
                        <li>b. Angkutan laut luar negeri;</li>
                        <li>c. Angkutan laut khusus; dan</li>
                        <li>d. Angkutan laut pelayaran-rakyat.</li>
                    </ol>

                    <h3>Paragraf 2</h3>
                    <h4>Angkutan Laut Dalam Negeri</h4>

                    <p>Pasal 8</p>
                    <ol>
                        <li>Kegiatan angkutan laut dalam negeri dilakukan oleh
                            perusahaan angkutan laut nasional dengan
                            menggunakan kapal berbendera Indonesia serta diawaki oleh
                            Awak Kapal berkewarganegaraan Indonesia. </li>
                        <li>Kapal asing dilarang mengangkut penumpang dan/atau
                            barang antarpulau atau antarpelabuhan di wilayah
                            perairan Indonesia. </li>
                    </ol>

                    <p>Pasal 9</p>
                    <ol>
                        <li>Kegiatan angkutan laut dalam negeri disusun dan
                            dilaksanakan secara terpadu, baik intra-maupun
                            antarmoda yang merupakan satu kesatuan sistem
                            transportasi nasional. </li>
                        <li>Kegiatan angkutan laut dalam negeri sebagaimana
                            dimaksud pada ayat (1) dilaksanakan dengan trayek tetap dan
                            teratur (liner) serta dapat dilengkapi dengan trayek tidak
                            tetap dan tidak teratur (tramper). </li>
                        <li>Kegiatan angkutan laut dalam negeri yang melayani trayek
                            tetap dan teratur dilakukan dalam jaringan trayek.</li>
                        <li>Jaringan trayek tetap dan teratur angkutan laut dalam
                            negeri disusun dengan memperhatikan:
                            <ol>
                                <li>pengembangan pusat industri, perdagangan, dan
                                    pariwisata;</li>
                                <li>pengembangan wilayah dan/atau daerah; </li>
                                <li>rencana umum tata ruang; </li>
                                <li>keterpaduan intra-dan antarmoda transportasi; dan</li>
                                <li>perwujudan Wawasan Nusantara. </li>
                            </ol>
                        </li>
                        <li>Penyusunan jaringan trayek tetap dan teratur
                            sebagaimana dimaksud pada ayat (4) dilakukan bersama oleh
                            Pemerintah, pemerintah daerah, dan asosiasi perusahaan
                            angkutan laut nasional dengan memperhatikan
                            masukan asosiasi pengguna jasa angkutan laut. </li>
                        <li>Jaringan trayek tetap dan teratur sebagaimana dimaksud pada
                            ayat (5) ditetapkan oleh Menteri.</li>
                        <li>Pengoperasian kapal pada jaringan trayek tetap dan teratur
                            sebagaimana dimaksud pada ayat (5) dilakukan oleh
                            perusahaan angkutan laut nasional dengan
                            mempertimbangkan:</li>
                        <ol>
                            <li>kelaiklautan kapal;</li>
                            <li>menggunakan kapal berbendera Indonesia dan
                                diawaki oleh warga negara Indonesia; </li>
                            <li>keseimbangan permintaan dan tersedianya ruangan; </li>
                            <li>kondisi alur dan fasilitas pelabuhan yang disinggahi;</li>
                            <li>tipe dan ukuran kapal sesuai dengan kebutuhan.</li>
                        </ol>
                    </ol>
                    <p>Kembali ke <Link href="/?Bab1">Bab 1</Link></p>
                </div>
            </div>
        </div>
    )
}