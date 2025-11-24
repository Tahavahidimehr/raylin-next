export default function About() {
    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 my-10 text-text">

            <h2 className="text-2xl font-bold mb-4 text-prime">درباره رایلین</h2>

            <p className="leading-8 text-[15px] mb-4">
                رایلین اکسسوری از دل عشق به زیبایی، ظرافت و درخشش جزئیات کوچک روزمره متولد شد.
                ما باور داریم یک اکسسوری کوچک می‌تواند حال‌وهوای یک روز، یک استایل یا حتی یک احساس را تغییر دهد؛
                برای همین در رایلین مجموعه‌ای کامل و متنوع از اکسسوری‌های دخترانه و زنانه را در کنار هم جمع کرده‌ایم.
            </p>

            <p className="leading-8 text-[15px] mb-4">
                در رایلین می‌توانید هر چیزی که برای خاص‌تر شدن استایلتان لازم دارید پیدا کنید:
            </p>

            <ul className="list-disc pr-6 leading-7 text-[15px] mb-4">
                <li>گردنبندهای ظریف و خاص</li>
                <li>ست‌های شیک و هماهنگ</li>
                <li>انگشترهای ترند و لاکچری</li>
                <li>گوشواره‌های جذاب و متنوع</li>
                <li>دستبندهای ظریف و ماندگار</li>
                <li>اکسسوری مو، سنجاق، گیره، اسکرانچی و…</li>
                <li>و کلی انتخاب دیگر در دسته‌بندی‌ها</li>
            </ul>

            <p className="leading-8 text-[15px] mb-4">
                رایلین در <span className="font-semibold text-prime">شیراز</span> فعالیت می‌کند و همیشه تلاشمان این است
                که
                بهترین کیفیت، سریع‌ترین ارسال و زیباترین بسته‌بندی را برای شما فراهم کنیم.
            </p>

            <p className="leading-8 text-[15px] font-semibold mb-8">
                رایلین اکسسوری؛ دنیای درخشانِ جزئیات تو ✨
            </p>

            <hr className="my-6 border-second/30"/>

            <h3 className="text-xl font-bold mb-3 text-prime">تماس با ما</h3>

            <div className="space-y-2 text-[15px] leading-7">
                <p><span className="font-semibold pl-2">شماره تماس:</span>
                    <a href="tel:09336407175" className="text-prime hover:underline">09336407175</a>
                </p>

                <p><span className="font-semibold pl-2">ایمیل:</span>
                    <a href="mailto:info@raylin.ir" className="text-prime hover:underline">info@raylin.ir</a>
                </p>
            </div>
        </div>
    )
}