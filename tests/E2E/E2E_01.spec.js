import { test,expect} from "../../Fixtures/baseFixture.js";
import Login from "../../delta_Page_Object_Model/LoginModule/loginPage.js";
import HomePage from "../../delta_Page_Object_Model/DashBoardModule/homePage.js";
import AddEmployee from "../../delta_Page_Object_Model/PIMModule/addEmployee.js";
import PIMPage from "../../delta_Page_Object_Model/PIMModule/PIMPage.js";
import { EmployeeList } from "../../delta_Page_Object_Model/PIMModule/employeeList.js";
import { ActionUtils } from "../../delta_Utility/actionUtils.js";

test("Verify employee creation, search, and profile update workflow", async({page})=>
{
   const homePage= new HomePage(page)
   const addemp= new AddEmployee(page)
   const pimpg= new PIMPage(page)
   const employeelist = new EmployeeList(page)
   let firstname="Pratheep"
   let middlename="raj"
   let lastname="Stalin"
   //const actionUtils= new ActionUtils()

   //Navigate to dashboard 
   await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index")

   //Navigate to PIM
   await homePage.PIMLink.click();
   await expect(page).toHaveURL(/\/pim\/viewEmployeeList/)

   //Click Add Employee
   await pimpg.addEmployeeLink.click()
   await expect(page.locator("//h6[contains(@class,'main-title')]")).toHaveText("Add Employee")

   //Enter First Name
   const firstnametxtfld=addemp.firstnameTextField;
   await firstnametxtfld.waitFor({state:"attached"})
   await ActionUtils.fill(firstnametxtfld,firstname)
   await expect(firstnametxtfld).toHaveValue(firstname)

   //Enter Middle Name
   const midnametxtfld=addemp.middlenameTextField;
   await midnametxtfld.waitFor({state:"attached"})
   await ActionUtils.fill(midnametxtfld,middlename)
   await expect(midnametxtfld).toHaveValue(middlename)
   
   //Enter Last Name
   const lastnametxtfld= addemp.lastnameTextField;
   await lastnametxtfld.waitFor({state:"attached"})
   await ActionUtils.fill(lastnametxtfld,lastname)
   await expect(lastnametxtfld).toHaveValue(lastname)


   //Fetch Employee ID
   let empID=await addemp.employeeIdTextField.inputValue()
   console.log(`EmployeeID :${empID}`);

   //click on save button
   await addemp.saveEmployeeButton.click()
   await page.waitForTimeout(3000)
   await pimpg.employeeListLink.click()
   let empIdsearchTxtfld= employeelist.employeeIdSearchTextField;
   await empIdsearchTxtfld.waitFor({state:"attached"})
   await ActionUtils.fill(empIdsearchTxtfld,empID)
   await employeelist.searchButton.click()
   await page.locator("(//div[@class='oxd-table-header']/following-sibling::div//div)[9]").waitFor({state:"attached"})
   let first=await page.locator("(//div[@class='oxd-table-header']/following-sibling::div//div)[9]").textContent()
   let middle=await page.locator("(//div[@class='oxd-table-header']/following-sibling::div//div)[11]").textContent()
   console.log(first.trim());
   console.log(middle.trim());
   
   
   if(first.trim()===`${firstname} ${middlename}` && middle.trim()===lastname)
   {
      console.log("Names are matching")
   }
   else{
      throw new Error("Names are not matching")
   }

   await page.locator("//div[@class='oxd-table-card']").click()
   await expect(page.locator("//h6[contains(@class,'strong')]")).toHaveText(`${firstname} ${lastname}`)
   await employeelist.maritalStatusDD.click()
   await employeelist.maritalStatusOptionSingle.click()
   await employeelist.personalDetailModifySaveBtn.click()
   await page.reload()
   //console.log(text);
   







   await page.waitForLoadState("load")
   //addemp.
})