(function () {
  "use strict";

  const fill = (text, values) => Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    text
  );

  const bandFor = (index) => {
    const slot = index % 20;
    if (slot < 6) return "600–695";
    if (slot < 12) return "700–795";
    if (slot < 17) return "800–895";
    return "900–990";
  };

  function makeQuestion(source, index) {
    const correctIndex = index % 4;
    const choices = [...source.distractors];
    choices.splice(correctIndex, 0, source.correct);
    return {
      id: `R${String(index + 1).padStart(4, "0")}`,
      level: source.level,
      type: source.type,
      band: bandFor(index),
      passage: source.passage || "",
      prompt: source.prompt,
      choices,
      answer: correctIndex,
      explain: source.explain
    };
  }

  const part5Contexts = [
    { team: "marketing team", report: "campaign report", deadline: "Friday afternoon", channel: "search campaign", company: "Northstar Media", person: "Ms. Lin" },
    { team: "finance department", report: "expense forecast", deadline: "Wednesday morning", channel: "billing system", company: "Harbor Finance", person: "Mr. Chen" },
    { team: "sales division", report: "quarterly proposal", deadline: "next Monday", channel: "customer portal", company: "Summit Sales", person: "Ms. Patel" },
    { team: "operations group", report: "workflow summary", deadline: "the end of the day", channel: "reporting platform", company: "Cedar Operations", person: "Mr. Wong" },
    { team: "human resources team", report: "training schedule", deadline: "July 28", channel: "employee website", company: "Brightpath Services", person: "Ms. Garcia" },
    { team: "procurement unit", report: "vendor evaluation", deadline: "noon tomorrow", channel: "ordering system", company: "Meridian Supply", person: "Mr. Davis" },
    { team: "customer service team", report: "complaint analysis", deadline: "Thursday evening", channel: "support dashboard", company: "Bluewave Support", person: "Ms. Brown" },
    { team: "product department", report: "launch checklist", deadline: "August 3", channel: "project workspace", company: "Vertex Products", person: "Mr. Taylor" },
    { team: "legal team", report: "contract revision", deadline: "the board meeting", channel: "document system", company: "Oakridge Legal", person: "Ms. Wilson" },
    { team: "analytics group", report: "performance dashboard", deadline: "9 a.m. tomorrow", channel: "data warehouse", company: "Signal Analytics", person: "Mr. Lee" },
    { team: "facilities department", report: "renovation notice", deadline: "the holiday weekend", channel: "staff intranet", company: "Parkside Offices", person: "Ms. Martin" },
    { team: "travel office", report: "booking confirmation", deadline: "the passenger's departure", channel: "reservation platform", company: "Atlas Travel", person: "Mr. Clark" }
  ];

  const part5Templates = [
    ["介系詞", "The {team} is responsible ___ the {report}.", "for", ["to", "of", "with"], "be responsible for 是固定搭配，表示『負責』。"],
    ["截止時間", "Please submit the {report} ___ {deadline}.", "by", ["until", "during", "since"], "by 表示最晚截止時間；until 強調動作持續到某時。"],
    ["動詞搭配", "The {team} agreed ___ the revised schedule.", "to", ["with", "for", "at"], "agree to + 事項；agree with + 人或意見。"],
    ["介系詞", "At {company}, the final decision depends ___ the client's approval.", "on", ["of", "to", "for"], "depend on 是固定搭配。"],
    ["現在完成式", "{company} ___ the {channel} since May.", "has used", ["used", "will use", "is use"], "since + 起始時間通常搭配現在完成式。"],
    ["過去式", "{person} ___ the {report} yesterday.", "reviewed", ["reviews", "has reviewed", "will review"], "yesterday 是明確過去時間，使用過去式。"],
    ["未來式", "The {team} ___ the client tomorrow morning.", "will contact", ["contacted", "has contacted", "contacts yesterday"], "tomorrow 是未來時間訊號。"],
    ["過去完成式", "By the time the meeting began, {person} ___ the {report}.", "had finished", ["finishes", "will finish", "is finishing"], "過去某事件前已完成的動作用過去完成式。"],
    ["被動語態", "The {report} ___ by the {team} every Monday.", "is prepared", ["prepares", "is preparing", "has prepare"], "報告是被製作的，使用 be + p.p.。"],
    ["情態動詞", "At {company}, all receipts must ___ before reimbursement.", "be submitted", ["submit", "submitting", "submitted"], "must 後接原形；被動形式為 must be submitted。"],
    ["詞性", "The new {channel} improves operational ___.", "efficiency", ["efficient", "efficiently", "efficientize"], "形容詞 operational 後需要名詞 efficiency。"],
    ["副詞", "The {team} responded ___ to the request.", "quickly", ["quick", "quickness", "quicker"], "修飾 responded 這個動詞要用副詞。"],
    ["形容詞", "The {team} needs a more ___ estimate before launch.", "accurate", ["accuracy", "accurately", "accuracies"], "estimate 是名詞，前面需要形容詞 accurate。"],
    ["主謂一致", "The list of required documents ___ on the {channel}.", "is", ["are", "were", "be"], "真正主詞是單數 The list，不是 documents。"],
    ["主謂一致", "Each of the {team}'s reports ___ a summary page.", "includes", ["include", "including", "are include"], "Each 視為單數，動詞使用 includes。"],
    ["連接詞", "___ the budget was reduced, the {team} revised the plan.", "Because", ["Unless", "Before", "Despite"], "前句是原因，後句是結果，因此用 Because。"],
    ["轉折", "___ {company}'s schedule is tight, the plan remains feasible.", "Although", ["Because", "Unless", "During"], "前後語意相反，用 Although 表示讓步。"],
    ["動名詞", "The {team} considered ___ the launch date.", "changing", ["to change", "change", "changed"], "consider 後接 V-ing。"],
    ["不定詞", "{person} decided ___ the {report}.", "to revise", ["revising", "revise", "revised"], "decide 後接 to V。"],
    ["比較級", "The new {channel} works ___ than the old one.", "more efficiently", ["efficient", "most efficiently", "more efficient than"], "修飾 works 要用副詞比較級 more efficiently。"],
    ["最高級", "This is the ___ result {company} has achieved this year.", "best", ["better", "well", "more good"], "有範圍 this year，且前有 the，使用最高級 best。"],
    ["關係代名詞", "The consultant ___ reviewed the {report} will join the call.", "who", ["which", "where", "when"], "先行詞 consultant 是人，主格關係代名詞用 who。"],
    ["分詞", "The documents ___ by {person} were incomplete.", "provided", ["providing", "provide", "provides"], "documents 與 provide 是被動關係，使用過去分詞。"],
    ["條件句", "If the client approves the {report}, the {team} ___ the project next week.", "will launch", ["launched", "would launched", "launching"], "第一類條件句：If + 現在式，主句用 will + 原形。"],
    ["商務字彙", "The {team} prepared a ___ plan in case the launch was delayed.", "contingency", ["consequence", "connection", "convenience"], "contingency plan 表示應變或備援計畫。"]
  ];

  const part5 = part5Templates.flatMap((template, templateIndex) => {
    return part5Contexts.map((context, contextIndex) => {
      const [type, prompt, correct, distractors, explain] = template;
      return {
        level: "Part 5",
        type,
        prompt: fill(prompt, context),
        correct: fill(correct, context),
        distractors: distractors.map((choice) => fill(choice, context)),
        explain
      };
    });
  });

  const part6Contexts = [
    { company: "Northstar Media", team: "marketing team", item: "campaign report", day: "Friday afternoon", person: "Ms. Lin", place: "conference room A" },
    { company: "Harbor Finance", team: "finance department", item: "expense forecast", day: "Wednesday morning", person: "Mr. Chen", place: "main auditorium" },
    { company: "Meridian Supply", team: "procurement unit", item: "vendor evaluation", day: "Monday noon", person: "Ms. Patel", place: "training room 2" },
    { company: "Atlas Travel", team: "travel office", item: "booking summary", day: "Thursday evening", person: "Mr. Davis", place: "online meeting room" }
  ];

  const part6Blueprints = [
    {
      type: "Email 完形",
      passage: "Subject: {item} update\n\nThe {team} has [1] completed the first draft of the {item}. The final version will be uploaded [2] {day}. Please [3] the figures before the file is sent to the client. [4]",
      questions: [
        ["Blank [1]", "successfully", ["successful", "success", "succeed"], "has successfully completed：副詞修飾 completed。"],
        ["Blank [2]", "by", ["until", "during", "since"], "by + 時間表示截止點。"],
        ["Blank [3]", "review", ["reviewed", "reviewing", "reviews"], "祈使句 Please 後接原形動詞。"],
        ["Blank [4]", "Thank you for your cooperation.", ["The office was painted blue.", "Sales are a type of furniture.", "Yesterday will arrive soon."], "結尾應使用符合商務信脈絡的致謝句。"]
      ]
    },
    {
      type: "公告完形",
      passage: "Notice to all employees\n\n{company} will hold a training session in {place}. Attendance is [1] for all members of the {team}. Participants should arrive [2] 9 a.m. and bring a laptop. {person} will [3] the new reporting procedure. [4]",
      questions: [
        ["Blank [1]", "mandatory", ["temporary", "optionality", "tentatively"], "mandatory 表示強制參加。"],
        ["Blank [2]", "before", ["among", "despite", "throughout"], "arrive before 9 a.m. 表示九點前抵達。"],
        ["Blank [3]", "demonstrate", ["demonstration", "demonstrated", "demonstrating"], "will 後接原形動詞 demonstrate。"],
        ["Blank [4]", "Questions will be answered at the end of the session.", ["The invoice has four wheels.", "Please cancel every employee.", "The weather invoices the client."], "此句延續訓練公告的合理流程。"]
      ]
    },
    {
      type: "通知完形",
      passage: "Dear customer,\n\nWe are writing to [1] you that maintenance on our online system is scheduled for {day}. During this period, some services may be temporarily [2]. We recommend that you complete urgent transactions [3] the maintenance begins. [4]",
      questions: [
        ["Blank [1]", "inform", ["information", "informed", "informative"], "write to inform someone 是正式通知用法。"],
        ["Blank [2]", "unavailable", ["availability", "availably", "unavailability"], "be 後需要形容詞 unavailable。"],
        ["Blank [3]", "before", ["because", "whereas", "despite"], "緊急交易要在維護開始前完成。"],
        ["Blank [4]", "We apologize for any inconvenience.", ["The system eats a schedule.", "Our chairs are profitable.", "Invoices travel by weather."], "服務中斷通知常以致歉收尾。"]
      ]
    },
    {
      type: "招聘完形",
      passage: "{company} is seeking a coordinator to support the {team}. The ideal candidate should have [1] communication skills and at least two years of relevant experience. Responsibilities [2] preparing the {item} and coordinating meetings. Applications must be submitted [3] {day}. [4]",
      questions: [
        ["Blank [1]", "excellent", ["excellence", "excellently", "excel"], "skills 前需要形容詞 excellent。"],
        ["Blank [2]", "include", ["includes", "including of", "included to"], "主詞 Responsibilities 是複數。"],
        ["Blank [3]", "by", ["until", "while", "during"], "by 表示申請截止時間。"],
        ["Blank [4]", "Only shortlisted candidates will be contacted.", ["Candidates must contact the weather.", "The job was a restaurant menu.", "Every salary is a meeting room."], "招聘公告常說僅聯絡入選者。"]
      ]
    },
    {
      type: "會議完形",
      passage: "The monthly review meeting has been [1] from Tuesday to {day}. This change was made because {person} will be [2] on Tuesday. Please update your calendar and send any agenda items [3] the {team}. [4]",
      questions: [
        ["Blank [1]", "rescheduled", ["rescheduling", "schedule", "reschedules"], "會議被改期，使用被動 has been rescheduled。"],
        ["Blank [2]", "unavailable", ["unavailability", "unavailably", "available not"], "be 後用形容詞 unavailable。"],
        ["Blank [3]", "to", ["at", "of", "during"], "send something to someone。"],
        ["Blank [4]", "An updated agenda will be distributed later.", ["The agenda repaired a laptop.", "Tuesday is an invoice.", "The room hired a manager."], "會議改期通知後合理補充更新議程。"]
      ]
    },
    {
      type: "訂單完形",
      passage: "Thank you for your recent order from {company}. Your items have been [1] and are expected to arrive by {day}. You can [2] the delivery through our customer portal. If the package is damaged, please contact us [3]. [4]",
      questions: [
        ["Blank [1]", "shipped", ["shipping", "ship", "shipment"], "have been shipped 是現在完成式被動。"],
        ["Blank [2]", "track", ["tracking", "tracked", "tracker"], "can 後接原形動詞 track。"],
        ["Blank [3]", "immediately", ["immediate", "immediacy", "more immediate"], "修飾 contact 要用副詞。"],
        ["Blank [4]", "We appreciate your business.", ["The package manages the company.", "Delivery is an employee benefit.", "The order attended a seminar."], "訂單通知以感謝惠顧收尾合理。"]
      ]
    },
    {
      type: "活動完形",
      passage: "Registration for the {company} networking event is now open. The event will take place in {place} on {day}. Space is limited, so attendees are encouraged to register [1]. A confirmation email will be sent [2] registration. Guests who have dietary restrictions should [3] them on the form. [4]",
      questions: [
        ["Blank [1]", "early", ["earliest", "earliness", "earlier than"], "register early 表示提早報名。"],
        ["Blank [2]", "after", ["unless", "despite", "among"], "確認信在報名後寄出。"],
        ["Blank [3]", "indicate", ["indication", "indicated", "indicating"], "should 後接原形動詞。"],
        ["Blank [4]", "We look forward to seeing you there.", ["The event invoices the weather.", "Dietary forms drive a bus.", "Registration was a desk."], "活動邀請常用期待見面的結尾。"]
      ]
    },
    {
      type: "政策完形",
      passage: "A revised remote-work policy at {company} will take [1] next month. Employees may work from home up to two days per week, provided that their managers have given [2]. Requests should be submitted through the staff portal at least three days [3]. [4]",
      questions: [
        ["Blank [1]", "effect", ["effective", "effectively", "effects"], "take effect 是固定搭配，表示生效。"],
        ["Blank [2]", "approval", ["approve", "approved", "approving"], "given 後需要名詞 approval。"],
        ["Blank [3]", "in advance", ["in spite", "at once of", "during advance"], "in advance 表示事先。"],
        ["Blank [4]", "The full policy is available on the staff portal.", ["Managers are a type of calendar.", "The portal worked from a chair.", "Employees approve the weather."], "政策通知應指向完整規範。"]
      ]
    },
    {
      type: "付款完形",
      passage: "Our records at {company} show that the invoice for the {item} remains [1]. Payment was due last week. Please arrange payment as soon as [2], or contact our billing office if you believe this notice was sent in [3]. [4]",
      questions: [
        ["Blank [1]", "unpaid", ["paying", "payment", "pays"], "remain 後用形容詞 unpaid。"],
        ["Blank [2]", "possible", ["possibility", "possibly than", "possibilities"], "as soon as possible 是固定用語。"],
        ["Blank [3]", "error", ["erroneous", "mistakenly", "errors are"], "in error 表示誤寄或錯誤。"],
        ["Blank [4]", "A copy of the invoice is attached for reference.", ["Payment hired the department.", "The invoice traveled yesterday tomorrow.", "Billing is a conference chair."], "催款信附上發票副本最合理。"]
      ]
    },
    {
      type: "調查完形",
      passage: "{company} is conducting a survey to learn more about customer [1]. The survey takes approximately five minutes to complete. Responses will be kept [2] and used only for research purposes. Participants who submit the survey by {day} will be [3] in a prize drawing. [4]",
      questions: [
        ["Blank [1]", "preferences", ["prefer", "preferable", "preferably"], "customer preferences 表示顧客偏好。"],
        ["Blank [2]", "confidential", ["confidence", "confidentially keeping", "confide"], "keep + 受詞 + 形容詞。"],
        ["Blank [3]", "entered", ["entering", "entry", "enters"], "will be entered 是未來被動。"],
        ["Blank [4]", "Thank you for sharing your feedback.", ["The survey rented an office.", "Research delivers a chair.", "The prize is an invoice policy."], "調查邀請以感謝回饋收尾合理。"]
      ]
    }
  ];

  const part6 = part6Blueprints.flatMap((blueprint) => {
    return part6Contexts.flatMap((context) => {
      const passage = fill(blueprint.passage, context);
      return blueprint.questions.map(([prompt, correct, distractors, explain]) => ({
        level: "Part 6",
        type: blueprint.type,
        passage,
        prompt,
        correct: fill(correct, context),
        distractors: distractors.map((choice) => fill(choice, context)),
        explain
      }));
    });
  });

  const part7Contexts = [
    { company: "Northstar Media", person: "Ms. Lin", day: "Friday", time: "3 p.m.", place: "conference room A", item: "campaign report", product: "analytics dashboard", amount: "$240", reason: "a client meeting" },
    { company: "Harbor Finance", person: "Mr. Chen", day: "Wednesday", time: "10 a.m.", place: "main auditorium", item: "expense forecast", product: "billing portal", amount: "$560", reason: "a system upgrade" },
    { company: "Summit Sales", person: "Ms. Patel", day: "Monday", time: "1 p.m.", place: "training room 2", item: "quarterly proposal", product: "customer database", amount: "$315", reason: "a sales conference" },
    { company: "Cedar Operations", person: "Mr. Wong", day: "Thursday", time: "9 a.m.", place: "online meeting room", item: "workflow summary", product: "reporting platform", amount: "$180", reason: "scheduled maintenance" },
    { company: "Brightpath Services", person: "Ms. Garcia", day: "Tuesday", time: "11 a.m.", place: "branch office", item: "training schedule", product: "employee portal", amount: "$420", reason: "staff training" },
    { company: "Meridian Supply", person: "Mr. Davis", day: "Friday", time: "2 p.m.", place: "warehouse 4", item: "vendor evaluation", product: "ordering system", amount: "$690", reason: "inventory inspection" },
    { company: "Bluewave Support", person: "Ms. Brown", day: "Wednesday", time: "4 p.m.", place: "support center", item: "complaint analysis", product: "ticket dashboard", amount: "$275", reason: "a service review" },
    { company: "Vertex Products", person: "Mr. Taylor", day: "Monday", time: "8:30 a.m.", place: "design studio", item: "launch checklist", product: "prototype tracker", amount: "$830", reason: "a product demonstration" },
    { company: "Oakridge Legal", person: "Ms. Wilson", day: "Thursday", time: "2:30 p.m.", place: "boardroom", item: "contract revision", product: "document system", amount: "$950", reason: "a contract negotiation" },
    { company: "Atlas Travel", person: "Mr. Clark", day: "Tuesday", time: "5 p.m.", place: "airport office", item: "booking summary", product: "reservation platform", amount: "$375", reason: "a flight schedule change" }
  ];

  const part7Blueprints = [
    ["Email", "Subject: Revised {item}\n\nHello,\nThe {team} at {company} has completed the revised {item}. {person} will review the final figures before sending the file to the client on {day}. Please send any comments before {time}.\n\nThank you.", [
      ["What has been completed?", "The revised {item}", ["A travel visa", "A building lease", "A restaurant menu"]],
      ["Who will review the final figures?", "{person}", ["A new customer", "The building manager", "A delivery driver"]],
      ["When should comments be sent?", "Before {time}", ["After midnight", "Next year", "During a holiday"]]
    ]],
    ["公告", "NOTICE\nThe {place} will be unavailable on {day} because of {reason}. Employees who planned to use the room should reserve another location through the staff portal. Normal access will resume the following morning.", [
      ["What will be unavailable?", "The {place}", ["The entire company", "All customer accounts", "The parking fee"]],
      ["Why will it be unavailable?", "Because of {reason}", ["Because sales increased", "Because invoices were paid", "Because a candidate applied"]],
      ["What should employees do?", "Reserve another location", ["Cancel every project", "Purchase new furniture", "Call all customers"]]
    ]],
    ["訂單通知", "Thank you for ordering the {product} from {company}. Your payment of {amount} has been received, and the item will be shipped on {day}. A tracking number will be emailed once the package leaves our warehouse.", [
      ["What did the customer order?", "The {product}", ["A conference ticket", "A hotel breakfast", "An employment contract"]],
      ["How much was paid?", "{amount}", ["$25", "$1,500", "$9"]],
      ["When will tracking information be sent?", "After the package leaves the warehouse", ["Before payment", "After one year", "During the interview"]]
    ]],
    ["活動邀請", "{company} invites employees to a workshop at {place} on {day} at {time}. {person} will demonstrate the {product} and answer questions. Participants should bring a laptop and register by noon the previous day.", [
      ["What is the purpose of the event?", "To demonstrate the {product}", ["To sell office furniture", "To inspect a restaurant", "To renew a passport"]],
      ["What should participants bring?", "A laptop", ["A printed invoice", "A safety helmet", "A hotel key"]],
      ["When must participants register?", "By noon the previous day", ["After the workshop", "Next month", "At midnight afterward"]]
    ]],
    ["客戶信件", "Dear {person},\nWe reviewed your request concerning the {product}. Our technical team found that the issue was caused by {reason}. The service will be restored by {time} on {day}. We apologize for the inconvenience.", [
      ["What did the customer ask about?", "The {product}", ["A job opening", "A meal reservation", "An office chair"]],
      ["What caused the issue?", "{reason}", ["A successful campaign", "A completed survey", "A salary increase"]],
      ["When will service be restored?", "By {time} on {day}", ["Last year", "After retirement", "Before the company opened"]]
    ]],
    ["備忘錄", "MEMORANDUM\nTo: All staff\nFrom: {person}\nBeginning on {day}, employees must use the {product} to submit the {item}. Paper forms will no longer be accepted. A short guide is available on the company intranet.", [
      ["What changes on {day}?", "Employees must use the {product}", ["The company will close", "All salaries will decrease", "Customers must visit the warehouse"]],
      ["What will no longer be accepted?", "Paper forms", ["Online requests", "Meeting invitations", "Customer payments"]],
      ["Where is the guide?", "On the company intranet", ["At the airport", "Inside every invoice", "At a restaurant"]]
    ]],
    ["職缺", "{company} is hiring a coordinator for its operations team. The position involves preparing the {item}, arranging meetings, and assisting customers. Applicants should have two years of experience and submit a résumé by {day}.", [
      ["What position is available?", "An operations coordinator", ["A restaurant chef", "An airline pilot", "A museum guide"]],
      ["Which task is mentioned?", "Preparing the {item}", ["Repairing roads", "Designing clothing", "Teaching mathematics"]],
      ["What must applicants submit?", "A résumé", ["A purchase order", "A boarding pass", "A medical bill"]]
    ]],
    ["行程表", "VISIT SCHEDULE\n{time} — Meet {person} at {place}\n11 a.m. — Review the {item}\n1 p.m. — Lunch with the {company} team\n3 p.m. — Demonstration of the {product}", [
      ["What happens at 11 a.m.?", "A review of the {item}", ["A flight departs", "A payment is refunded", "A job interview ends"]],
      ["Who attends lunch?", "The {company} team", ["Only delivery drivers", "Hotel guests", "Medical patients"]],
      ["What is scheduled for 3 p.m.?", "A demonstration of the {product}", ["A tax payment", "A building inspection", "A train cancellation"]]
    ]],
    ["發票", "INVOICE\nSupplier: {company}\nItem: {product}\nAmount due: {amount}\nPayment deadline: {day}\nQuestions should be directed to {person} before the payment deadline.", [
      ["What is being billed?", "The {product}", ["A job interview", "A vacation request", "A training certificate"]],
      ["When is payment due?", "{day}", ["Yesterday morning", "After one year", "No deadline is given"]],
      ["Who answers questions?", "{person}", ["A hotel guest", "The bus driver", "Every customer"]]
    ]],
    ["調查邀請", "{company} is conducting a survey about the {product}. The questionnaire takes about five minutes, and all responses are confidential. Customers who respond by {day} will receive a {amount} discount on their next purchase.", [
      ["What is the survey about?", "The {product}", ["Employee salaries", "Airport security", "Office rent only"]],
      ["How long does it take?", "About five minutes", ["Two hours", "One week", "Thirty seconds exactly"]],
      ["What will participants receive?", "A {amount} discount", ["A free building", "A new job", "An airline license"]]
    ]],
    ["新聞稿", "{company} announced that it will introduce the {product} on {day}. According to {person}, the new system will reduce processing time and improve accuracy. Staff training will begin at {time} in {place}.", [
      ["What will be introduced?", "The {product}", ["A restaurant menu", "A new airport", "A health insurance claim"]],
      ["What benefit is expected?", "Reduced processing time", ["Higher office rent", "Longer customer waits", "More paper forms"]],
      ["Where will training occur?", "In {place}", ["At every customer's home", "On an airplane", "At a shopping mall only"]]
    ]],
    ["保固通知", "The {product} purchased from {company} includes a one-year warranty. Repairs caused by manufacturing defects are free, but damage caused by improper use is not covered. Contact {person} to arrange an inspection on {day}.", [
      ["How long is the warranty?", "One year", ["One week", "Five years", "No warranty"]],
      ["Which repair is free?", "A manufacturing defect", ["Damage from improper use", "A lost product", "A cosmetic preference"]],
      ["Why should the customer contact {person}?", "To arrange an inspection", ["To apply for a job", "To reserve a meal", "To change a flight"]]
    ]],
    ["航班通知", "Due to {reason}, the flight arranged by {company} will depart at {time} on {day}, two hours later than scheduled. Passengers should check in at the airport office and keep their original boarding passes.", [
      ["Why was the flight delayed?", "Because of {reason}", ["Because a report was approved", "Because sales increased", "Because training ended"]],
      ["When will it depart?", "At {time} on {day}", ["Two days earlier", "At noon yesterday", "No departure time is given"]],
      ["What should passengers keep?", "Their original boarding passes", ["Vendor invoices", "Employee résumés", "Meeting agendas"]]
    ]],
    ["餐廳公告", "The café in {place} will close early at {time} on {day} for {reason}. Employees may use the cafeteria on the first floor instead. Regular hours will resume the next business day.", [
      ["What will close early?", "The café", ["The entire company", "The customer portal", "The warehouse"]],
      ["Where can employees eat instead?", "The first-floor cafeteria", ["The airport office", "A client meeting", "The parking area"]],
      ["When will regular hours resume?", "The next business day", ["Next year", "Before the closure", "They will not resume"]]
    ]],
    ["合約摘要", "The agreement between {company} and its vendor begins on {day}. The vendor will maintain the {product} and submit a monthly {item}. Either party may terminate the agreement with 30 days' written notice.", [
      ["When does the agreement begin?", "{day}", ["Thirty years ago", "After termination", "No date is stated"]],
      ["What must the vendor submit?", "A monthly {item}", ["A boarding pass", "A restaurant review", "A job application"]],
      ["How can the agreement be terminated?", "With 30 days' written notice", ["With a phone call after one hour", "By ignoring invoices", "By changing the meeting room"]]
    ]],
    ["聊天訊息", "{person}: Is the {item} ready?\nColleague: Almost. I still need the figures from {company}.\n{person}: Please upload it by {time}. The client meeting is on {day}.\nColleague: I will finish it before lunch.", [
      ["What is not yet ready?", "The {item}", ["A flight ticket", "A meal", "An office renovation"]],
      ["What information is still needed?", "Figures from {company}", ["A passport number", "A restaurant menu", "A medical diagnosis"]],
      ["Why is there a deadline?", "There is a client meeting", ["The office is moving", "A flight was canceled", "The invoice was refunded"]]
    ]],
    ["退款政策", "Customers may return the {product} to {company} within 30 days of purchase. The item must be unused and accompanied by the original receipt. Refunds are processed within five business days after inspection.", [
      ["How long is the return period?", "30 days", ["Five hours", "One year", "There is no limit"]],
      ["What must accompany the item?", "The original receipt", ["A résumé", "A boarding pass", "A meeting invitation"]],
      ["When is the refund processed?", "After inspection", ["Before purchase", "During delivery", "Before the item is returned"]]
    ]],
    ["租賃通知", "The office lease for {company} will expire on {day}. {person} has asked the property manager to prepare a renewal proposal. The proposal should include the new monthly rate and any planned renovations to {place}.", [
      ["What will expire?", "The office lease", ["A product warranty", "A flight ticket", "An employee résumé"]],
      ["What did {person} request?", "A renewal proposal", ["A restaurant reservation", "A tax refund", "A training certificate"]],
      ["What information should the proposal include?", "The new monthly rate", ["Customer passwords", "Flight meal choices", "Employee shoe sizes"]]
    ]]
  ];

  const part7 = part7Blueprints.flatMap(([type, passageTemplate, questionTemplates]) => {
    return part7Contexts.flatMap((context) => {
      const passage = fill(passageTemplate, context);
      return questionTemplates.map(([prompt, correct, distractors]) => ({
        level: "Part 7",
        type,
        passage,
        prompt: fill(prompt, context),
        correct: fill(correct, context),
        distractors: distractors.map((choice) => fill(choice, context)),
        explain: "先定位人名、日期、目的與動作，再比對題目同義改寫；不要只靠單字長得像。"
      }));
    });
  });

  const questions = [...part5, ...part6, ...part7].map(makeQuestion);

  const concepts = [
    ["forecast", "n.", "預測", "sales forecast", "The sales forecast shows steady growth.", "報表"],
    ["projection", "n.", "預估", "revenue projection", "The revenue projection includes labor costs.", "財務"],
    ["revenue", "n.", "營收", "annual revenue", "Annual revenue increased by twelve percent.", "財務"],
    ["expenditure", "n.", "支出", "capital expenditure", "The board approved the capital expenditure.", "財務"],
    ["reimbursement", "n.", "報銷", "request reimbursement", "Employees may request reimbursement for travel costs.", "財務"],
    ["invoice", "n.", "發票", "issue an invoice", "The supplier issued an invoice yesterday.", "採購"],
    ["overdue", "adj.", "逾期的", "overdue payment", "The customer made the overdue payment.", "財務"],
    ["deductible", "adj.", "可扣除的", "tax-deductible expense", "Some training costs are tax-deductible expenses.", "財務"],
    ["liability", "n.", "責任／負債", "limit liability", "The agreement limits the company's liability.", "法務"],
    ["asset", "n.", "資產", "digital asset", "The team organized every digital asset.", "財務"],
    ["procurement", "n.", "採購", "procurement process", "The procurement process takes five business days.", "採購"],
    ["vendor", "n.", "供應商", "approved vendor", "We selected an approved vendor.", "採購"],
    ["inventory", "n.", "庫存", "inventory level", "The dashboard tracks the inventory level.", "採購"],
    ["shipment", "n.", "貨運", "track a shipment", "Customers can track a shipment online.", "物流"],
    ["defective", "adj.", "有瑕疵的", "defective product", "The store replaced the defective product.", "客服"],
    ["warranty", "n.", "保固", "warranty coverage", "The warranty coverage includes repairs.", "客服"],
    ["eligible", "adj.", "符合資格的", "eligible for", "Members are eligible for a discount.", "客服"],
    ["refund", "n.", "退款", "process a refund", "The company processed a refund within five days.", "客服"],
    ["complaint", "n.", "客訴", "handle a complaint", "The manager handled the complaint professionally.", "客服"],
    ["inquiry", "n.", "詢問", "respond to an inquiry", "The agent responded to the inquiry promptly.", "客服"],
    ["retention", "n.", "留存", "customer retention", "The campaign improved customer retention.", "行銷"],
    ["acquisition — customers", "n.", "獲取", "customer acquisition", "Customer acquisition costs increased.", "行銷"],
    ["prospective", "adj.", "潛在的", "prospective client", "The event attracted prospective clients.", "行銷"],
    ["incentive", "n.", "誘因／獎勵", "sales incentive", "The company introduced a sales incentive.", "業務"],
    ["campaign", "n.", "活動／廣告活動", "launch a campaign", "The agency launched a campaign in June.", "行銷"],
    ["conversion", "n.", "轉換", "conversion rate", "The landing page improved the conversion rate.", "行銷"],
    ["benchmark", "n.", "基準", "industry benchmark", "The result exceeded the industry benchmark.", "分析"],
    ["segment", "n./v.", "區隔", "customer segment", "The report compares each customer segment.", "行銷"],
    ["endorse", "v.", "支持／背書", "endorse a proposal", "The director endorsed the proposal.", "管理"],
    ["initiative", "n.", "倡議／計畫", "strategic initiative", "The strategic initiative reduced manual work.", "管理"],
    ["allocate", "v.", "分配", "allocate resources", "The manager allocated resources to the project.", "管理"],
    ["delegate", "v.", "委派", "delegate a task", "Supervisors should delegate routine tasks.", "管理"],
    ["streamline", "v.", "簡化流程", "streamline a workflow", "The new tool streamlined the workflow.", "營運"],
    ["consolidate", "v.", "整合", "consolidate data", "The analyst consolidated data from three systems.", "分析"],
    ["reconcile", "v.", "核對", "reconcile accounts", "The accountant reconciled the accounts.", "財務"],
    ["expedite", "v.", "加速處理", "expedite approval", "Please expedite approval of the request.", "營運"],
    ["scrutinize", "v.", "仔細審查", "scrutinize a contract", "The legal team scrutinized the contract.", "法務"],
    ["implement", "v.", "實施", "implement a policy", "The company implemented a new policy.", "管理"],
    ["facilitate", "v.", "促進／協助", "facilitate a meeting", "Ms. Lin facilitated the meeting.", "會議"],
    ["coordinate", "v.", "協調", "coordinate a schedule", "The assistant coordinated the schedule.", "會議"],
    ["compliance", "n.", "合規", "ensure compliance", "The audit ensures compliance with regulations.", "法務"],
    ["mandatory", "adj.", "強制的", "mandatory training", "Safety training is mandatory.", "人資"],
    ["confidential", "adj.", "機密的", "confidential information", "Keep all customer information confidential.", "法務"],
    ["authorization", "n.", "授權", "obtain authorization", "The purchase requires authorization.", "管理"],
    ["obligation", "n.", "義務", "contractual obligation", "The lease creates a contractual obligation.", "法務"],
    ["terminate", "v.", "終止", "terminate an agreement", "Either party may terminate the agreement.", "法務"],
    ["amendment", "n.", "修正條款", "contract amendment", "The lawyer drafted a contract amendment.", "法務"],
    ["provision", "n.", "條款／供應", "contract provision", "The provision limits additional fees.", "法務"],
    ["regulation", "n.", "法規", "safety regulation", "The factory follows every safety regulation.", "法務"],
    ["audit", "n./v.", "稽核", "conduct an audit", "The firm conducted an annual audit.", "財務"],
    ["appraisal", "n.", "考核／估價", "performance appraisal", "The annual performance appraisal begins next week.", "人資"],
    ["credential", "n.", "資歷／證明", "verify credentials", "The recruiter verified the candidate's credentials.", "人資"],
    ["candidate", "n.", "候選人", "qualified candidate", "The company interviewed a qualified candidate.", "人資"],
    ["vacancy", "n.", "職缺", "fill a vacancy", "The department hopes to fill the vacancy soon.", "人資"],
    ["orientation", "n.", "新人訓練", "employee orientation", "Employee orientation starts on Monday.", "人資"],
    ["compensation", "n.", "薪酬", "compensation package", "The compensation package includes insurance.", "人資"],
    ["promotion", "n.", "升遷／促銷", "earn a promotion", "She earned a promotion last year.", "人資"],
    ["resignation", "n.", "辭職", "submit a resignation", "He submitted his resignation in writing.", "人資"],
    ["relocation", "n.", "搬遷", "office relocation", "The office relocation begins next month.", "辦公室"],
    ["renovation", "n.", "翻修", "office renovation", "The office renovation will take six weeks.", "辦公室"],
    ["reservation", "n.", "預約", "confirm a reservation", "Please confirm the hotel reservation.", "旅遊"],
    ["itinerary", "n.", "行程", "travel itinerary", "The assistant updated the travel itinerary.", "旅遊"],
    ["accommodation", "n.", "住宿", "arrange accommodation", "The company arranged accommodation for the speaker.", "旅遊"],
    ["departure", "n.", "出發", "departure time", "The departure time has changed.", "旅遊"],
    ["destination", "n.", "目的地", "final destination", "Please check your final destination.", "旅遊"],
    ["postpone", "v.", "延期", "postpone a meeting", "The manager postponed the meeting.", "會議"],
    ["tentative", "adj.", "暫定的", "tentative schedule", "The tentative schedule may change.", "會議"],
    ["agenda", "n.", "議程", "meeting agenda", "The chair distributed the meeting agenda.", "會議"],
    ["minutes", "n.", "會議紀錄", "meeting minutes", "Please review the meeting minutes.", "會議"],
    ["attendee", "n.", "與會者", "event attendee", "Each attendee received a name badge.", "活動"],
    ["venue", "n.", "場地", "event venue", "The event venue holds 400 people.", "活動"],
    ["capacity", "n.", "容量／產能", "maximum capacity", "The room has a maximum capacity of 80.", "活動"],
    ["admission", "n.", "入場／錄取", "admission fee", "The admission fee includes lunch.", "活動"],
    ["exhibit", "n./v.", "展覽／展示", "trade exhibit", "The company displayed its product at the trade exhibit.", "活動"],
    ["maintenance", "n.", "維護", "scheduled maintenance", "Scheduled maintenance begins tonight.", "技術"],
    ["outage", "n.", "中斷", "service outage", "The service outage affected online orders.", "技術"],
    ["upgrade", "n./v.", "升級", "system upgrade", "The system upgrade improved security.", "技術"],
    ["compatible", "adj.", "相容的", "compatible with", "The software is compatible with older devices.", "技術"],
    ["specification", "n.", "規格", "technical specification", "The manual lists every technical specification.", "技術"],
    ["prototype", "n.", "原型", "test a prototype", "The engineers tested a prototype.", "研發"],
    ["durable", "adj.", "耐用的", "durable material", "The case is made of durable material.", "製造"],
    ["deteriorate", "v.", "惡化", "conditions deteriorate", "Road conditions deteriorated overnight.", "營運"],
    ["fluctuate", "v.", "波動", "prices fluctuate", "Fuel prices fluctuate throughout the year.", "財務"],
    ["substantial", "adj.", "大量的／實質的", "substantial increase", "The campaign produced a substantial increase in leads.", "分析"],
    ["preliminary", "adj.", "初步的", "preliminary result", "The preliminary results are encouraging.", "分析"],
    ["feasible", "adj.", "可行的", "feasible plan", "The revised plan is feasible.", "管理"],
    ["sufficient", "adj.", "足夠的", "sufficient evidence", "We have sufficient evidence to proceed.", "管理"],
    ["contingency", "n.", "備案", "contingency plan", "The team prepared a contingency plan.", "管理"],
    ["discrepancy", "n.", "差異／不一致", "resolve a discrepancy", "We resolved a discrepancy in the invoice.", "財務"],
    ["correspondence", "n.", "信件往來", "business correspondence", "Please keep all business correspondence.", "辦公室"],
    ["clarification", "n.", "澄清", "request clarification", "The client requested clarification on the fee.", "客服"],
    ["notification", "n.", "通知", "email notification", "You will receive an email notification.", "辦公室"],
    ["attachment", "n.", "附件", "email attachment", "The invoice is included as an email attachment.", "辦公室"],
    ["recipient", "n.", "收件人", "intended recipient", "The message reached the intended recipient.", "辦公室"],
    ["subscription", "n.", "訂閱", "annual subscription", "The annual subscription renews automatically.", "客服"],
    ["renewal", "n.", "續約", "contract renewal", "The manager approved the contract renewal.", "法務"],
    ["merger", "n.", "合併", "company merger", "The company merger was announced yesterday.", "企業"],
    ["acquisition — business", "n.", "收購", "business acquisition", "The acquisition expanded the firm's market share.", "企業"],
    ["subsidiary", "n.", "子公司", "overseas subsidiary", "The overseas subsidiary opened a new office.", "企業"],
    ["headquarters", "n.", "總部", "corporate headquarters", "The corporate headquarters is in Taipei.", "企業"],
    ["branch", "n.", "分公司", "local branch", "The local branch hired three employees.", "企業"],
    ["outsource", "v.", "外包", "outsource payroll", "The company outsourced payroll processing.", "營運"],
    ["negotiate", "v.", "協商", "negotiate terms", "They negotiated better payment terms.", "業務"],
    ["quote", "n./v.", "報價", "request a quote", "The buyer requested a quote from three vendors.", "採購"],
    ["bid", "n./v.", "投標", "submit a bid", "The contractor submitted a competitive bid.", "採購"]
  ];

  const coreConcepts = concepts.slice(0, 100);
  const baseWords = coreConcepts.map((row, index) => {
    const [term, pos, zh, collocation, example, topic] = row;
    return { id: `W${String(index + 1).padStart(3, "0")}`, term, pos, zh, example, tip: `常見搭配：${collocation}。`, collocation, topic, band: bandFor(index * 2) };
  });
  const phraseWords = coreConcepts.map((row, index) => {
    const [term, , zh, collocation, example, topic] = row;
    return { id: `W${String(index + 101).padStart(3, "0")}`, term: collocation, pos: "phrase", zh: `${zh}常見搭配`, example, tip: `把 ${term} 和搭配一起記，比單背中文更接近 TOEIC。`, collocation, topic, band: bandFor(index * 2) };
  });
  const usageWords = coreConcepts.map((row, index) => {
    const [term, , zh, collocation, example, topic] = row;
    return { id: `W${String(index + 201).padStart(3, "0")}`, term: `${term}｜用法`, pos: "usage", zh, example, tip: `情境：${topic}。先認得詞性，再看它在句子裡扮演什麼角色。`, collocation, topic, band: bandFor(index * 2) };
  });
  const words = [...baseWords, ...phraseWords, ...usageWords];

  const writingContexts = [
    { item: "campaign report", person: "the client", day: "Wednesday morning", action: "review", result: "confirm the launch budget", issue: "the conversion data is incomplete" },
    { item: "expense forecast", person: "the finance manager", day: "Friday afternoon", action: "approve", result: "finalize the quarterly plan", issue: "two invoices are still missing" },
    { item: "vendor proposal", person: "the procurement team", day: "Monday noon", action: "compare", result: "select a supplier", issue: "the delivery schedule is unclear" },
    { item: "training schedule", person: "all employees", day: "Thursday evening", action: "confirm", result: "reserve the meeting room", issue: "several participants are unavailable" },
    { item: "customer survey", person: "the research team", day: "next Tuesday", action: "analyze", result: "prepare the presentation", issue: "the response rate is lower than expected" },
    { item: "launch checklist", person: "the product manager", day: "August 3", action: "update", result: "start the pilot campaign", issue: "the final assets have not arrived" },
    { item: "contract revision", person: "the legal team", day: "tomorrow morning", action: "review", result: "send the agreement for signature", issue: "one clause needs clarification" },
    { item: "booking summary", person: "the travel coordinator", day: "the end of the day", action: "verify", result: "issue the tickets", issue: "the return flight was changed" },
    { item: "workflow draft", person: "the operations manager", day: "Friday", action: "test", result: "reduce manual reporting", issue: "the dashboard is not syncing correctly" },
    { item: "sales presentation", person: "the account team", day: "next Monday", action: "revise", result: "present the proposal to the client", issue: "the pricing slide is outdated" }
  ];

  const writingBlueprints = [
    ["Email", "請寫一封英文信，請 {person} 在 {day} 前寄回更新後的 {item}。", "Could you please send me the updated {item} by {day}?", [["send", "share", "provide"], ["{item}"], ["by", "before"], ["please", "could"]]],
    ["進度回報", "請用英文說明：你已經完成 {item}，下一步要 {action}，以便 {result}。", "I have completed the {item}. The next step is to {action} it so that we can {result}.", [["completed", "finished"], ["{item}"], ["{action}"], ["{result}"]]],
    ["問題回報", "請用英文回報問題：{issue}，可能會影響 {item} 的時程。", "The current issue is that {issue}, which may affect the timeline for the {item}.", [["{issue}"], ["affect", "delay", "impact"], ["timeline", "schedule"], ["{item}"]]],
    ["延期通知", "請寫英文通知：因為 {issue}，{item} 將延後，並承諾在 {day} 前更新進度。", "Because {issue}, the {item} will be delayed. I will provide an update by {day}.", [["because", "due to"], ["delay", "postpone"], ["update"], ["{day}"]]],
    ["會議邀請", "請用英文邀請 {person} 在 {day} 開會討論 {item}。", "I would like to invite {person} to a meeting on {day} to discuss the {item}.", [["invite", "meeting"], ["{person}"], ["{day}"], ["discuss", "review"]]],
    ["數據說明", "請用英文說明：{item} 的結果比預期好，但仍要 {action} 後才能 {result}。", "The results of the {item} were better than expected, but we still need to {action} them before we can {result}.", [["better", "improved", "strong"], ["expected", "forecast"], ["{action}"], ["{result}"]]],
    ["禮貌催件", "請寫一封禮貌英文催件信，提醒 {person}：{item} 的截止時間是 {day}。", "This is a friendly reminder that the {item} is due by {day}. Could you please let me know when it will be ready?", [["reminder", "follow up"], ["{item}"], ["due", "deadline"], ["{day}"]]],
    ["建議方案", "請用英文提出建議：先 {action} {item}，因為這樣能 {result}。", "I recommend that we {action} the {item} first because this will help us {result}.", [["recommend", "suggest"], ["{action}"], ["{item}"], ["{result}"]]],
    ["確認理解", "請用英文向 {person} 確認：你理解目前問題是 {issue}，並會在 {day} 前回覆。", "My understanding is that {issue}. I will confirm the next steps with {person} and reply by {day}.", [["understanding", "understand"], ["{issue}"], ["reply", "respond", "confirm"], ["{day}"]]],
    ["成果摘要", "請用英文寫兩句成果摘要：你負責 {item}，透過 {action} 幫助團隊 {result}。", "I was responsible for the {item}. By taking the lead on the work, I helped the team {result}.", [["responsible", "managed", "led"], ["{item}"], ["helped", "enabled"], ["{result}"]]]
  ];

  let writingId = 0;
  const rewrites = writingBlueprints.flatMap(([category, prompt, answer, keywordGroups], blueprintIndex) => {
    return writingContexts.map((context, index) => ({
      id: `E${String(++writingId).padStart(3, "0")}`,
      category,
      band: bandFor(index + blueprintIndex * 10),
      prompt: fill(prompt, context),
      answer: fill(answer, context),
      keywords: keywordGroups.map((group) => group.map((keyword) => fill(keyword, context))),
      pattern: category === "Email" || category === "禮貌催件" ? "Polite request + item + deadline." : "Situation + action + result."
    }));
  });

  if (questions.length !== 1000 || words.length !== 300 || rewrites.length !== 100) {
    throw new Error(`TOEIC data count mismatch: ${questions.length}/${words.length}/${rewrites.length}`);
  }

  window.TOEIC_DATA = { questions, words, rewrites };
})();
