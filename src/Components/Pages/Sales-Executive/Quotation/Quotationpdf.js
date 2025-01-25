import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import logo from "./../../../Images/Company_logo.png"

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 0,
  },
  logo: {
    width: 100,
    height: 100,
    borderRight: 1,
    padding: 10,
  },
  companyInfo: {
    padding: 10,
    flex: 1,
  },
  companyName: {
    fontSize: 12,
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    marginTop: -1,
  },
  billingSection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: -1,
  },
  billingLeft: {
    flex: 1,
    padding: 10,
    borderRight: 1,
  },
  billingRight: {
    flex: 1,
    padding: 10,
  },
  table: {
    marginTop: -1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTop: 0,
    borderColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  cellNo: {
    width: '5%',
  },
  cellDesc: {
    width: '30%',
  },
  cellMembers: {
    width: '10%',
  },
  cellRate: {
    width: '15%',
  },
  cellRooms: {
    width: '15%',
  },
  cellGST: {
    width: '10%',
  },
  cellTotal: {
    width: '15%',
    borderRightWidth: 0,
  },
  summary: {
    flexDirection: 'row',
    marginTop: -1,
    borderWidth: 1,
    borderColor: '#000',
  },
  summaryLeft: {
    flex: 1,
    padding: 10,
    borderRight: 1,
  },
  summaryRight: {
    width: '40%',
    padding: 10,
  },
  footer: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  signatureSection: {
    marginTop: 40,
  },
  thankYou: {
    textAlign: 'center',
    marginTop: 10,
  },
});

const QuotationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image src={logo} />
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>KRIKA MKB CORPORATION PRIVATE LIMITED(iQbots)</Text>
          <Text>Skyline Beverly Park, P.P 402, Attavarakhadi Road South, Amruthahalli,</Text>
          <Text>Bangalore - 560092, KARNATAKA</Text>
          <Text>Email: abhijith.mavatoor@gmail.com,Phone:9481024700</Text>
          <Text>GSTIN:29AAICK7493G1ZX</Text>
        </View>
      </View>

      <View style={styles.title}>
        <Text>GST QUOTATION</Text>
      </View>

      <View style={styles.billingSection}>
        <View style={styles.billingLeft}>
          <Text style={{ marginBottom: 5 }}>Billing Address:</Text>
          <Text>S-300001, Jyoti Nagar</Text>
          <Text>chandrampal, Rajanna sicilla</Text>
          <Text>Hyderabad-501505</Text>
          <Text>Telangana</Text>
        </View>
        <View style={styles.billingRight}>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ width: '40%' }}>Quotation Number:</Text>
            <Text>{data.quotationNumber}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ width: '40%' }}>Quotation Date:</Text>
            <Text>{data.quotationDate}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ width: '40%' }}>Due Date:</Text>
            <Text>{data.dueDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.cellNo]}>#</Text>
          <Text style={[styles.tableCell, styles.cellDesc]}>Service Description</Text>
          <Text style={[styles.tableCell, styles.cellMembers]}>Members</Text>
          <Text style={[styles.tableCell, styles.cellRate]}>RATE</Text>
          <Text style={[styles.tableCell, styles.cellRooms]}>No of rooms</Text>
          <Text style={[styles.tableCell, styles.cellGST]}>GST</Text>
          <Text style={[styles.tableCell, styles.cellTotal]}>TOTAL</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cellNo]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.cellDesc]}>{item.description}</Text>
            <Text style={[styles.tableCell, styles.cellMembers]}>{item.members}</Text>
            <Text style={[styles.tableCell, styles.cellRate]}>{item.rate}</Text>
            <Text style={[styles.tableCell, styles.cellRooms]}>{item.rooms}</Text>
            <Text style={[styles.tableCell, styles.cellGST]}>{item.gst}</Text>
            <Text style={[styles.tableCell, styles.cellTotal]}>{item.total}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryLeft}>
          <Text style={{ marginBottom: 10 }}>Amount in words: {data.amountInWords}</Text>
          <Text style={{ marginBottom: 5 }}>Bank Details:</Text>
          <Text>Bank Name: {data.bankName}</Text>
          <Text>Account Name: {data.accountName}</Text>
          <Text>Account No: {data.accountNo}</Text>
          <Text>IFSC Code: {data.ifscCode}</Text>
        </View>
        <View style={styles.summaryRight}>
          <Text>Non-taxable Amount: {data.nonTaxableAmount}</Text>
          <Text>Taxable Amount: {data.taxableAmount}</Text>
          <Text>GST Total: {data.gstTotal}</Text>
          <Text>Adjustment: {data.adjustment}</Text>
          <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
            Quotation Total: {data.quotationTotal}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>For KRIKA MKB CORPORATION PRIVATE LIMITED</Text>
        <View style={styles.signatureSection}>
          <Text>Authorised Signatory</Text>
        </View>
        <Text style={styles.thankYou}>Thank you for your Business!</Text>
      </View>
    </Page>
  </Document>
);

export default QuotationPDF;