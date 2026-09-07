import Link from "next/link";

const sections = [
	{
		id: "start",
		title: "Bắt đầu trong vài phút",
		steps: [
			"Đăng ký hoặc đăng nhập bằng email và mật khẩu.",
			"Vào Thư viện, tạo bộ sưu tập rồi thêm chủ đề. Ví dụ: Giao tiếp → Nhà hàng.",
			"Tự tạo bài, import JSON hoặc vào Khám phá để sao chép một bài mẫu.",
			"Mở bài học và bắt đầu Learn. Học tiếp phiên đang dở từ trang Hôm nay.",
		],
		href: "/library",
		link: "Mở thư viện",
	},
	{
		id: "content",
		title: "Tạo và quản lý nội dung",
		steps: [
			"Mỗi bài chứa từ vựng, ngữ pháp, cụm từ, mẫu câu hoặc collocation. Bài ngắn khoảng 4-8 kiến thức sẽ dễ theo dõi hơn.",
			"Thêm câu hỏi cho đủ Learn, Use, Recall, Expand. Câu một đáp án có đúng một lựa chọn đúng; câu nhiều đáp án có ít nhất hai.",
			"Viết giải thích cho cả đáp án đúng và sai. Ảnh/audio dùng URL HTTPS, kèm mô tả.",
			"Bấm Lưu bài học. Bản nháp được phép chưa đầy đủ; bài Cá nhân hoặc Công khai phải hợp lệ ở cả bốn stage.",
			"Dùng nút mũi tên để sắp xếp. Xóa cần xác nhận; lịch sử học vẫn được giữ. Nếu báo xung đột phiên bản, giữ tab hiện tại và kiểm tra bản mới trong tab khác.",
		],
		href: "/library",
		link: "Quản lý nội dung",
	},
	{
		id: "json",
		title: "Import, export và chia sẻ",
		steps: [
			"Ở Thư viện, chọn Import JSON, tải file hoặc dán nội dung có schemaVersion: 1. Có sẵn JSON mẫu để tham khảo.",
			"Bấm Xem trước. Nếu có lỗi, sửa theo tên trường được báo. Chọn chủ đề đích hoặc tạo ngay bên dưới, rồi bấm Import bài học.",
			"Bài import được lưu thành bản nháp. Export trên trang bài học xuất nội dung đã lưu, không gồm tiến độ.",
			"Bài Công khai xuất hiện trong Khám phá. Người khác có thể sao chép vào chủ đề của họ; bản sao độc lập, không mang tiến độ.",
			"Chuyển về Cá nhân hoặc xóa bài sẽ gỡ bài gốc khỏi Khám phá, không xóa bản sao của người khác.",
		],
		href: "/explore",
		link: "Khám phá bài học",
	},
	{
		id: "learn",
		title: "Học qua bốn góc nhìn",
		steps: [
			"Learn: làm quen với kiến thức. Use: chọn cách dùng trong ngữ cảnh. Recall: nhớ lại. Expand: mở rộng cách diễn đạt.",
			"Câu một đáp án: bấm lựa chọn để chấm ngay. Câu nhiều đáp án: chọn đủ rồi bấm Kiểm tra đáp án.",
			"Đọc popup kết quả và giải thích, sau đó bấm Tiếp tục. Đáp án đã chấm không sửa được.",
			"Trả lời sai có thể thêm biến thể luyện tập, tối đa hai câu thêm mỗi stage. Hoàn thành đủ bốn stage là hoàn thành bài, không cần đúng hết.",
			"Bạn có thể tải lại để tiếp tục. Khi mất mạng, giữ tab mở và thử lại; không bắt đầu lượt mới nếu muốn nối tiếp lượt cũ.",
		],
		href: "/dashboard",
		link: "Học tiếp",
	},
	{
		id: "review",
		title: "Ôn tập và sổ lỗi sai",
		steps: [
			"Ôn nhanh ưu tiên kiến thức yếu hoặc lâu chưa gặp, tối đa 10 câu; ngân hàng ít câu thì phiên sẽ ngắn hơn.",
			"Bấm Lưu để ôn để đánh dấu riêng một kiến thức. Cờ này không tự thay đổi mức độ ghi nhớ.",
			"Sổ lỗi sai tập hợp kiến thức yếu/đang ôn lại có lịch sử sai. Luyện lỗi sai chỉ lấy từ nhóm này.",
			"Luyện ngẫu nhiên chỉ lấy kiến thức đã học. Mỗi kiến thức được gặp một lần trước khi chọn biến thể tiếp theo.",
			"Ôn tập cập nhật mức ghi nhớ nhưng không đánh dấu một bài đã hoàn thành bốn stage.",
		],
		href: "/review",
		link: "Mở ôn tập",
	},
	{
		id: "exam",
		title: "Tự kiểm tra bằng bài thi",
		steps: [
			"Tạo đề từ câu hỏi trong các bài cá nhân đã sẵn sàng, chọn câu và sắp xếp thứ tự. Ứng dụng không tự sinh đề.",
			"Khi làm bài, bạn có thể quay lại, đổi lựa chọn, lưu đáp án và tiếp tục sau.",
			"Bài thi chỉ hiện đáp án và giải thích sau khi nộp. Câu bỏ trống tính sai; câu nhiều đáp án phải chọn khớp hoàn toàn.",
			"Xem mọi lượt trong lịch sử. Mức tăng/giảm chỉ so sánh các lượt cùng phiên bản đề.",
			"Điểm thi được thống kê riêng, không làm thay đổi mastery hoặc danh sách ôn tập.",
		],
		href: "/exams",
		link: "Mở bài kiểm tra",
	},
	{
		id: "progress",
		title: "Đọc tiến độ và chỉnh hồ sơ",
		steps: [
			"Hôm nay cho biết học tiếp gì, ôn gì, số câu đã học và kết quả tuần này. Tiến độ hiển thị thống kê ngày và lịch sử.",
			"Hoàn thành bài khác với ghi nhớ: mastery là tỷ lệ kiến thức hiện đã ghi nhớ, có thể thay đổi qua các lượt học/ôn.",
			"Mức ghi nhớ dùng tối đa 8 câu gần nhất. Đã ghi nhớ cần ít nhất 7/8 câu đúng, từng đúng cả bốn stage và học trên ít nhất hai ngày.",
			"Ngày hoạt động cần ít nhất một câu học/ôn đã chấm. Streak dùng múi giờ trong hồ sơ; thời gian nghỉ quá 60 giây không tính vào tương tác.",
			"Bấm vòng tròn tên ở góc phải để sửa tên, múi giờ, giao diện hoặc đổi mật khẩu. Email hiện chưa hỗ trợ thay đổi.",
		],
		href: "/account",
		link: "Mở hồ sơ",
	},
];
export default function GuidePage() {
	return (
		<>
			<header className="page-heading">
				<div>
					<h1>Học cách dùng Solo English</h1>
					<p>Từ bài học đầu tiên đến thói quen ôn tập của bạn.</p>
				</div>
			</header>
			<div className="guide-layout">
				<nav className="guide-nav panel" aria-label="Mục lục hướng dẫn">
					{sections.map((section) => (
						<a key={section.id} className="text-link" href={`#${section.id}`}>
							{section.title}
						</a>
					))}
					<a className="text-link" href="#tips">
						Mẹo học hiệu quả
					</a>
				</nav>
				<div className="stack">
					{sections.map((section) => (
						<section className="panel stack guide-section" id={section.id} key={section.id}>
							<h2>{section.title}</h2>
							<ol>
								{section.steps.map((step) => (
									<li key={step}>{step}</li>
								))}
							</ol>
							<Link className="text-link" href={section.href}>
								{section.link}
							</Link>
						</section>
					))}
					<section className="panel stack guide-section" id="tips">
						<h2>Mẹo học hiệu quả</h2>
						<ul>
							<li>Thử nhớ câu trả lời trước khi nhìn các lựa chọn.</li>
							<li>Sau khi sai, đọc giải thích rồi tự đặt một câu mới với kiến thức đó.</li>
							<li>
								Chia nội dung thành bài ngắn, học đều thay vì cố hoàn thành thật nhiều một lúc.
							</li>
							<li>Ôn lại vào những ngày khác nhau. Đừng chỉ đọc lại bài vừa thuộc.</li>
							<li>Dùng tình huống thật của bạn: gọi món, viết email, giới thiệu bản thân.</li>
							<li>Xem xu hướng nhiều ngày, không tự đánh giá chỉ từ một điểm thi thấp.</li>
						</ul>
					</section>
				</div>
			</div>
		</>
	);
}
