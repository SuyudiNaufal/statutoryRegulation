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
    const bagian = searchParam.get("bagian");
    // ambil statutories
    async function getStatutories() {
        const { data: statutories, error } = await supabase
            .from('statutories')
            .select(`*,
            statutory_categories(*),
            statutory_attachments(*),
            chapters(
                *,
                paragraphs(*)
            )
            `)
        if (!statutories) {
            return
        }
        setStatutories(statutories as any)
    }
    React.useEffect(() => { getStatutories() }, []
        // [] only run once
    )
    console.log(statutories)

    const[paragraphContent,setParagraphContent] = useState<any[]>([])
    async function getParagraphContent (){
        const { data: paragraphs, error } = await supabase
        .from('paragraphs')
        .select("*")
        // filter
        .eq('slug', bagian)
        if (!paragraphs) {
            return
        }
        setParagraphContent(paragraphs as any)
    }
    React.useEffect (() => {getParagraphContent()}, [bagian])

   
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
                        <summary className={styles.treeNavTitle}>Undang-Undang</summary>

                        {statutories.map((statutory) => {
                            return (<details className={`${styles.treeNav} ${styles.isExpandable}`} key={statutory.id}>
                                <summary className={styles.treeNavTitle}>{statutory.statutory_title}</summary>

                                {/* BAB 1 */}
                                {statutory.chapters.map((chapter : any) => {
                                return <details className={`${styles.treeNav} ${styles.isExpandable}`} key={chapter.id}>
                                    <summary className={styles.treeNavTitle}>{chapter.chapter_title}</summary>

                                    <div className={styles.treeNavTitleDiv}>
                                    {chapter.paragraphs.map((paragraph : any) => {
                                        
                                    return (
                                        <Link className={styles.treeNavTitleDivList} href={`/?bagian=${paragraph.slug}`} key={paragraph.id}>{paragraph.paragraph_title}</Link>
                                    )})}
                                    </div>
                                </details>})}
                                    
                            </details>)
                        })}
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
                <div
      dangerouslySetInnerHTML={{__html: paragraphContent[0]?.paragraph_content}}
    />

                    
                    <p>Kembali ke <Link href="/?Bab1">Bab 1</Link></p>
                </div>
            </div>
        </div>
    )
}