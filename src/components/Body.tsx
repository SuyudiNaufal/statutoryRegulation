'use client'
// import CSS
import Link from "next/link"
import styles from "./body.module.css"
import { useSearchParams } from "next/navigation"

export default function Body() {
    const searchParam = useSearchParams();
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


                            <details className={`${styles.treeNav} ${styles.isExpandable}`}>
                                <summary className={styles.treeNavTitle}>BAB 1</summary>


                                <div className={styles.treeNavTitleDiv}>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian1">Bagian 1</Link>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian2">Bagian 2</Link>
                                    <Link className={styles.treeNavTitleDivList} href="/?bagian=Bagian3">Bagian 3</Link>
                                </div>



                            </details>
                        </details>
                    </details>
                </div>
            </div>
            <div className={styles.bodyRight}>
                <div className={styles.bodyRightTop}>
                    <h4>Undang-Undang - Undang-Undang Nomor 17 Tahun 2008 - Bab 1 - Bagian 2</h4>
                </div>
                <div className={styles.bodyRightBottom}>
                    <h1>Bagian 2</h1>
                    <h3>Pasal 56</h3>
                    <p>
                        Pengembangan dan pengadaan armada angkutan perairan nasional dilakukan dalam rangka memberdayakan angkutan perairan nasional dan memperkuat industri perkapalan nasional yang dilakukan secara terpadu dengan dukungan semua sektor terkait.
                    </p>

                    <h3>Pasal 57</h3>
                    <p>
                        (1) Pemberdayaan industri angkutan perairan nasional sebagaimana dimaksud dalam Pasal 56 wajib dilakukan oleh Pemerintah dengan:
                    </p>
                    <ol type="a">
                        <li>memberikan fasilitas pembiayaan dan perpajakan;</li>
                        <li>memfasilitasi kemitraan kontrak jangka panjang antara pemilik barang dan pemilik kapal; dan</li>
                        <li>memberikan jaminan ketersediaan bahan bakar minyak untuk angkutan di perairan.</li>
                    </ol>

                    <p>(2) Perkuatan industri perkapalan nasional sebagaimana dimaksud dalam Pasal 56 wajib dilakukan oleh Pemerintah dengan:</p>
                    <ol type="a">
                        <li>menetapkan kawasan industri perkapalan terpadu;</li>
                        <li>mengembangkan pusat desain, penelitian, dan pengembangan industri kapal nasional;</li>
                        <li>mengembangkan standardisasi dan komponen kapal dengan menggunakan sebanyak-banyaknya muatan lokal dan melakukan alih teknologi;</li>
                        <li>mengembangkan industri bahan baku dan komponen kapal;</li>
                        <li>memberikan insentif kepada perusahaan angkutan perairan nasional yang membangun dan/atau mereparasi kapal di dalam negeri dan/atau yang melakukan pengadaan kapal dari luar negeri;</li>
                        <li>membangun kapal pada industri galangan kapal nasional apabila biaya pengadaannya dibebankan kepada Anggaran Pendapatan Belanja Negara atau Anggaran Pendapatan Belanja Daerah;</li>
                    </ol>
                    <p>Kembali ke <Link href="/?Bab1">Bab 1</Link></p>
                </div>
            </div>
        </div>
    )
}