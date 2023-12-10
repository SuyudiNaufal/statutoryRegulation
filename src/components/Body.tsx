"use client";
// import CSS
import Link from "next/link";
import styles from "./body.module.css";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Body() {
  const [statutories, setStatutories] = useState<any[]>([]);
  const searchParam = useSearchParams();
  const supabase = createClientComponentClient();
  const bagian = searchParam.get("bagian");
  const bab = searchParam.get("bab");
  const peraturan = searchParam.get("peraturan");
  const judul = searchParam.get("judul");
  const router = useRouter();
  const searchEngine = searchParam.get("search");

  const [searchQuery, setSearchQuery] = useState<string>("");
  // ambil statutories
  async function getStatutories() {
    const { data: statutories, error } = await supabase
      .from("statutories")
      .select(
        `*,
            statutory_categories(*),
            statutory_attachments(*),
            chapters(
                *,
                paragraphs(*)
            )
            `
      )
      .order("slug", { foreignTable: "chapters", ascending: true })
      .order("slug", { foreignTable: "chapters.paragraphs", ascending: true });
    if (!statutories) {
      return;
    }

    setStatutories(statutories as any);
  }
  React.useEffect(
    () => {
      getStatutories();
    },
    []
    // [] only run once
  );

  // ambil isi dari bagian

  const [paragraphContent, setParagraphContent] = useState<any[]>([]);
  async function getParagraphContent() {
    const { data: paragraphs, error } = await supabase
      .from("paragraphs")
      .select(
        `*,
            chapters(*)
            `
      )
      // filter
      .eq("slug", bagian);

    if (!paragraphs) {
      return;
    }
    console.log(paragraphs);
    setParagraphContent(paragraphs as any);
  }
  React.useEffect(() => {
    getParagraphContent();
  }, [bagian]);

  // ambil isi dari BAB (Bagian 1, 2 ,dst)
  const [chapterContent, setChapterContent] = useState<any[]>([]);
  async function getChapterContent() {
    const { data: chapters, error } = await supabase
      .from("chapters")
      .select(`*`)

      // filter
      .eq("slug", peraturan);

    if (!chapters) {
      return;
    }
    console.log(chapters);
    setChapterContent(chapters as any);
  }
  React.useEffect(() => {
    getChapterContent();
  }, [peraturan]);

  // Ambil isi dari Judul Peraturan (Bab 1, 2, dst)
  const [statutoryContent, setStatutoryContent] = useState<any[]>([]);
  async function getStatutoryContent() {
    let { data: statutories, error } = await supabase
      .from("statutories")
      .select("*")
      // Filters
      .eq("slug", judul);
    if (!statutories) {
      return;
    }
    setStatutoryContent(statutories as any);
  }
  React.useEffect(() => {
    getStatutoryContent();
  }, [judul]);

  // Buat konstante untuk welcome sign
  const ketiganyaNull =
    judul === null && bagian === null && peraturan === null ? true : false;

  // Ngasih event ke router untuk push ke
  function handleSearchChange(event: any) {
    const value = event.target.value;
    console.log(value);
    setSearchQuery(value);
  }

  // Buat fungsi untuk submit
  function searchButtonOnClick() {
    router.push(`/?search=${searchQuery}`);
  }
  // Query ke supabase, semuanya dijoin buat filter tree dropdown
  // !inner untuk inner join
  async function getSearchStatutories() {
    // const { data: statutories, error } = await supabase
    //     .from('statutories')
    //     .select(`*,
    //     statutory_categories!inner(*),
    //     statutory_attachments!inner(*),
    //     chapters!inner(
    //         *,
    //         paragraphs!inner(*)
    //     )
    //     `)
    //     .order('id', { foreignTable: 'chapters', ascending: true })
    //     .or(`chapter_title.ilike.%${searchEngine}%`, {foreignTable:'chapters'})
    // if (!statutories) {
    //     return
    // }

    const { data: statutories, error } = await supabase.rpc("search_words", {
      input_text: searchEngine,
    });

    if (error) {
      console.log(error);
      throw error;
    }

    const paragraphsIds = statutories.map(
      (statutory: any) => statutory.paragraph_id
    );

    const chaptersIds = statutories
      .map((statutory: any, index: number) => {
        if (index === 0) {
          return statutory.chapter_id;
        } else if (statutory.chapter_id !== statutories[index - 1].chapter_id) {
          // Remove duplicates
          return statutory.chapter_id;
        }
      })
      .filter((chapterId: any) => chapterId);

    console.log("paragraphsIds: \n", paragraphsIds.join(", "));
    console.log("chapterIds: \n", chaptersIds.join(", "));

    const { data: statutories2, error: error2 } = await supabase
      .from("statutories")
      .select(
        `*,
        statutory_categories(*),
        statutory_attachments(*),
        chapters!inner(
            *,
            paragraphs!inner(*)
        )
        `
      )
      .in("chapters.paragraphs.id", paragraphsIds);

    if (error2) {
      console.log(error2);
      throw error2;
    }

    setStatutories(statutories2 as any);
  }

  console.log("hasil search: ", searchEngine, statutories);

  React.useEffect(() => {
    if (searchEngine) {
      getSearchStatutories();
    }
  }, [searchEngine]);
  // KODE YANG BAKALAN DITAMPILIN
  // Buat konstanta untuk posisi search dipake

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.bodyLeft}>
        <div className={styles.bodyLeftTop}>
          <div className={styles.bodySearchBar}>
            <input
              type="text"
              placeholder="Search Peraturan"
              className={styles.searchBar}
              name="searchBar"
              onChange={handleSearchChange}
            ></input>
            <button
              className={styles.buttonSearch}
              onClick={searchButtonOnClick}
            >
              Search
            </button>
          </div>
        </div>

        <div className={styles.bodyLeftBottom}>
          {/* UNDANG UNDANG  */}
          <div>
            {statutories.map((statutory) => {
              return (
                <details
                  className={`${styles.treeNav} ${styles.isExpandable}`}
                  key={statutory.slug}
                >
                  <summary
                    className={styles.treeNavTitle}
                    onClick={() => router.push(`/?judul=${statutory.slug}`)}
                  >
                    {statutory.statutory_title}
                  </summary>

                  {/* BAB 1 */}
                  {statutory.chapters.map((chapter: any) => {
                    return (
                      <details
                        className={`${styles.treeNav} ${styles.isExpandable}`}
                        key={chapter.slug}
                      >
                        <summary
                          className={styles.treeNavTitle}
                          onClick={() =>
                            router.push(`/?peraturan=${chapter.slug}`)
                          }
                        >
                          {chapter.chapter_title}
                        </summary>

                        <>
                          <div className={styles.treeNavTitleDiv}>
                            {chapter.paragraphs.map((paragraph: any) => {
                              return (
                                <Link
                                  className={styles.treeNavTitleDivList}
                                  href={`/?bagian=${paragraph.slug}`}
                                  key={paragraph.slug}
                                >
                                  {paragraph.paragraph_title}
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      </details>
                    );
                  })}
                </details>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.bodyRight}>
        <div className={styles.bodyRightTop}>
          <h4>
            {judul
              ? statutoryContent[0]?.statutory_title
              : bagian
              ? paragraphContent[0]?.chapters.chapter_title
              : peraturan
              ? chapterContent[0]?.chapter_title
              : `Homepage`}
          </h4>
        </div>
        <div className={styles.bodyRightBottom}>
          {/* TAMBAHIN YANG BAB */}

          {
            <div>
              {ketiganyaNull ? (
                // Render Component1 when both values are null
                <div>Selamat Datang</div>
              ) : (
                // Render Component2 when at least one value is not null
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: judul
                        ? statutoryContent[0]?.statutory_content
                        : bagian
                        ? paragraphContent[0]?.paragraph_content
                        : peraturan
                        ? chapterContent[0]?.chapter_content
                        : null,
                    }}
                  />
                  <p>
                    <Link
                      href={`/?peraturan=${paragraphContent[0]?.chapters.slug}`}
                    >
                      Kembali{" "}
                      {bagian
                        ? paragraphContent[0]?.chapters.chapter_title
                        : peraturan
                        ? chapterContent[0]?.statutory_title
                        : null}
                    </Link>
                  </p>
                </>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
