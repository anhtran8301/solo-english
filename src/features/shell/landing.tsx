import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Fingerprint, Layers, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingMotion } from "./landing-motion";

const steps = [
	["Learn", "Hiểu điều mới.", "Hiểu nghĩa, cách dùng và học thêm từ cả những đáp án chưa đúng."],
	[
		"Use",
		"Đặt vào cuộc sống.",
		"Gặp kiến thức trong những cuộc trò chuyện và tình huống quen thuộc.",
	],
	["Recall", "Tự mình nhớ lại.", "Nhận ra từ ngữ theo một chiều khác, không cần gõ câu trả lời."],
	[
		"Expand",
		"Kết nối rộng hơn.",
		"Khám phá từ liên quan, cách diễn đạt và những kết hợp tự nhiên.",
	],
];
export function LandingPage() {
	return (
		<LandingMotion>
			<section className="hero">
				<div className="hero-copy" data-reveal>
					<span className="hero-eyebrow">TIẾNG ANH THEO CÁCH CỦA BẠN</span>
					<h1>
						Học một chút.
						<br />
						<span>Nhớ lâu hơn.</span>
					</h1>
					<p>Tự tạo bài học, luyện trong ngữ cảnh và quay lại với những điều bạn chưa nhớ.</p>
					<div className="actions">
						<Button asChild size="lg">
							<Link href="/register">
								Bắt đầu học
								<ArrowRight />
							</Link>
						</Button>
						<Link className="text-link" href="/explore">
							Khám phá bài học
						</Link>
					</div>
				</div>
				<div className="hero-image" data-scale>
					<Image
						src="/images/learning-desk.png"
						alt="Sổ tay học tiếng Anh, tai nghe và bút xanh bên cửa sổ"
						width={1536}
						height={1024}
						loading="eager"
						fetchPriority="high"
						sizes="(max-width: 767px) 100vw, 55vw"
					/>
				</div>
			</section>
			<section className="landing-section learning-story">
				<div className="landing-heading" data-reveal>
					<h2>
						Một kiến thức.
						<br />
						Bốn cách để ghi nhớ.
					</h2>
					<p>Mỗi lần gặp lại là một góc nhìn mới. Bài học ngắn, đủ để bạn muốn quay lại.</p>
				</div>
				<div className="four-steps">
					{steps.map(([stage, title, description]) => (
						<article key={stage} data-reveal>
							<span>{stage}</span>
							<h3>{title}</h3>
							<p>{description}</p>
						</article>
					))}
				</div>
			</section>
			<section className="landing-section real-life">
				<div className="real-life-image" data-scale>
					<Image
						src="/images/real-conversation.png"
						alt="Hai đồng nghiệp trò chuyện bằng tiếng Anh trong quán cà phê"
						width={1536}
						height={1024}
						sizes="(max-width: 767px) 100vw, 50vw"
					/>
				</div>
				<div data-reveal>
					<h2>
						Tiếng Anh để dùng.
						<br />
						Không chỉ để thuộc.
					</h2>
					<p>
						Một lời chào, một cuộc họp, một chuyến đi. Học từ vựng, ngữ pháp và mẫu câu trong những
						tình huống bạn thực sự gặp.
					</p>
					<Link className="text-link" href="/explore">
						Tìm bài học gần với bạn <ArrowRight size={17} />
					</Link>
				</div>
			</section>
			<section className="landing-section">
				<div className="landing-heading" data-reveal>
					<h2>
						Bạn chọn nội dung.
						<br />
						Solo giúp bạn học.
					</h2>
				</div>
				<div className="feature-bento">
					<article className="feature-wide" data-reveal>
						<Fingerprint size={38} strokeWidth={1.2} />
						<h3>Một thư viện mang dấu ấn riêng.</h3>
						<p>
							Tự viết bài, import JSON hoặc sao chép bài được chia sẻ. Tất cả đều có thể chỉnh sửa
							theo cách của bạn.
						</p>
						<div className="topic-cloud">
							<span>English for work</span>
							<span>Everyday phrases</span>
							<span>Grammar essentials</span>
						</div>
					</article>
					<article className="feature-review" data-reveal>
						<RotateCcw size={30} strokeWidth={1.3} />
						<h3>Dành thời gian cho điều cần nhớ.</h3>
						<p>Kiến thức thường sai được gom lại. Một phiên ôn ngắn giúp bạn tập trung đúng chỗ.</p>
					</article>
					<article className="feature-progress" data-reveal>
						<Layers size={30} strokeWidth={1.3} />
						<h3>Nhìn thấy bước tiến.</h3>
						<p>Theo dõi từng kiến thức, tự tạo bài kiểm tra và so sánh kết quả qua mỗi lần học.</p>
					</article>
				</div>
			</section>
			<section className="landing-section final-cta" data-reveal>
				<BookOpen size={36} strokeWidth={1.3} />
				<h2>
					Hôm nay, bắt đầu
					<br />
					bằng một chút.
				</h2>
				<p>Một bài học của riêng bạn. Một bước tiến có thể nhìn thấy.</p>
				<Button asChild size="lg">
					<Link href="/register">
						Bắt đầu học
						<ArrowRight />
					</Link>
				</Button>
			</section>
		</LandingMotion>
	);
}
