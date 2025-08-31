"use client";

import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function ServicesPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        আমাদের সেবাসমূহ
      </Typography>
      <Typography paragraph>
        আমিন ডায়াগনস্টিক এ আমরা আধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসকদের সহায়তায় নিম্নলিখিত সেবা
        প্রদান করি:
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        ডায়াগনস্টিক সেবা
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="অত্যাধুনিক ল্যাবে সর্বাধুনিক প্রযুক্তির বিশ্বসেরা ব্র্যান্ডের মেশিনে পরীক্ষা-নীরিক্ষা" />
        </ListItem>
        <ListItem>
          <ListItemText primary="FNAC, হিস্টোপ্যাথলজি ও যাবতীয় ক্যান্সার স্ক্রিনিং টেস্ট" />
        </ListItem>
        <ListItem>
          <ListItemText primary="স্ব স্ব বিভাগে বিশেষজ্ঞ চিকিৎসকের পরামর্শ" />
        </ListItem>
        <ListItem>
          <ListItemText primary="স্বাস্থ্য পরীক্ষা প্যাকেজ" />
        </ListItem>
        <ListItem>
          <ListItemText primary="হোম/অফিস স্যাম্পল কালেকশন সুবিধা" />
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        ইমেজিং ও বিশেষ পরীক্ষা
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="আল্ট্রাসাউন্ড, ডিজিটাল এক্স-রে, সিটি স্ক্যান ও মাল্টি স্লাইস সিটি স্ক্যান" />
        </ListItem>
        <ListItem>
          <ListItemText primary="কার্ডিয়াক ইমেজিং, ইসিজি, ইটিটি, ইকোকার্ডিওগ্রাম" />
        </ListItem>
        <ListItem>
          <ListItemText primary="কন্ট্রাস্ট এক্স-রে, এন্ডোস্কোপি ও কলোনোস্কোপি" />
        </ListItem>
        <ListItem>
          <ListItemText primary="বিশেষ পরীক্ষা যেমন এফএনএসি, বায়োপসি, স্পাইরোমেট্রি" />
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        ক্লিনিকাল সেবা
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="মেডিসিন, শিশু, গাইনী, ইএনটি, হৃদরোগ, অর্থোপেডিক ও ইউরোলজি" />
        </ListItem>
        <ListItem>
          <ListItemText primary="চর্মরোগ, গ্যাস্ট্রোএন্টারোলজি, নিউরো, ডায়াবেটিস ও থাইরয়েড" />
        </ListItem>
        <ListItem>
          <ListItemText primary="ক্যান্সার, মানসিক স্বাস্থ্য ও আরও অনেক বিশেষায়িত বিভাগ" />
        </ListItem>
      </List>
      <Typography paragraph sx={{ mt: 2 }}>
        আমাদের লক্ষ্য, প্রতিটি রোগীকে সর্বোচ্চ যত্ন ও নির্ভুল রোগ নির্ণয়ের মাধ্যমে সুস্থ
        জীবনের পথে এগিয়ে দেওয়া।
      </Typography>
    </Box>
  );
}
