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
                                        <Link href="/?bagian=Bagian1">Bagian 1</Link>
                                        <Link href="/?bagian=Bagian2">Bagian 2</Link>
                                        <Link href="/?bagian=Bagian3">Bagian 3</Link>
                                    </div>



                            </details>
                        </details>
                    </details>
                </div>
            </div>
            <div className={styles.bodyRight}>{
                bagian
            }</div>
        </div>
    )
}